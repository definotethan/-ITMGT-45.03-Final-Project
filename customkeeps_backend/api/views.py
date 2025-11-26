from django.contrib.auth.models import User
from django.conf import settings
from django.db import transaction

from rest_framework import generics, viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response

from .models import Product, Order, OrderItem, CartItem, Coupon  # include Coupon
from .serializers import (
    RegisterSerializer, 
    ProductSerializer, 
    OrderSerializer,
    CartItemSerializer
)

import stripe
import uuid
from decimal import Decimal
from django.utils import timezone

stripe.api_key = settings.STRIPE_SECRET_KEY

# User registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

# Product CRUD (must be logged in to view)
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

# Cart ViewSet
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        existing_item = CartItem.objects.filter(
            user=request.user,
            product_name=request.data.get('product_name'),
            base_color=request.data.get('base_color'),
            customization_text=request.data.get('customization_text', ''),
            design_image_url=request.data.get('design_image_url', '')
        ).first()

        if existing_item:
            existing_item.quantity += int(request.data.get('quantity', 1))
            existing_item.save()
            serializer = self.get_serializer(existing_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response({'message': 'Cart cleared'}, status=status.HTTP_204_NO_CONTENT)

# Order ViewSet
class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')

    @transaction.atomic
    @action(detail=False, methods=['post'])
    def create_from_cart(self, request):
        print('=== Creating Order from Cart ===')
        print('User:', request.user.username)
        print('Request data:', request.data)

        cart_items = CartItem.objects.filter(user=request.user)
        print(f'Cart items count: {cart_items.count()}')

        if not cart_items.exists():
            return Response(
                {'error': 'Cart is empty'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        total_amount = sum(item.price * item.quantity for item in cart_items)
        coupon_code = request.data.get('coupon_code', '').upper()
        discount_amount = Decimal('0.00')

        # Coupon system (dynamic, from admin model)
        coupon = None
        if coupon_code:
            now = timezone.now()
            try:
                coupon = Coupon.objects.get(
                    code__iexact=coupon_code, 
                    active=True, 
                    valid_from__lte=now, 
                    valid_to__gte=now
                )
                discount_amount = total_amount * (coupon.discount_percent / Decimal('100'))
            except Coupon.DoesNotExist:
                pass  # Invalid/expired - no discount

        final_amount = total_amount - discount_amount

        print(f'Total: {total_amount}, Discount: {discount_amount}, Final: {final_amount}')

        # Create order record
        order = Order.objects.create(
            user=request.user,
            order_id=str(uuid.uuid4())[:8].upper(),
            total_amount=total_amount,
            discount_amount=discount_amount,
            final_amount=final_amount,
            coupon_code=coupon_code,
            payment_intent_id=request.data.get('payment_intent_id', '')
        )
        print(f'Order created: {order.order_id}')

        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product_name=cart_item.product_name,
                price=cart_item.price,
                quantity=cart_item.quantity,
                base_color=cart_item.base_color,
                customization_text=cart_item.customization_text,
                design_image_url=cart_item.design_image_url
            )

        cart_items.delete()
        serializer = self.get_serializer(order)
        print('Order created successfully!')
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def pay_view(request):
    try:
        amount_php = float(request.data.get("amount", 0))
        coupon_code = str(request.data.get("coupon_code", "") or "").upper()
        amount_cents = int(amount_php * 100)

        if amount_cents <= 0:
            return Response(
                {"error": "Invalid payment amount."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        payment_intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency="php",
            automatic_payment_methods={"enabled": True},
            metadata={
                'user_id': request.user.id,
                'username': request.user.username,
                'coupon_code': coupon_code
            }
        )
        return Response(
            {
                "clientSecret": payment_intent["client_secret"],
                "paymentIntentId": payment_intent["id"]
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print("Stripe error:", repr(e))
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )
