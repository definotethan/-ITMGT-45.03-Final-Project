# api/views.py

from django.contrib.auth.models import User
from django.conf import settings

from rest_framework import generics, viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Product, Order
from .serializers import RegisterSerializer, ProductSerializer, OrderSerializer

import stripe

# Configure Stripe with your secret key from settings.py
stripe.api_key = settings.STRIPE_SECRET_KEY

# User registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

# Product CRUD (anyone can see)
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

# Order CRUD (must be logged in)
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

# Stripe payment endpoint (must be logged in)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def pay_view(request):
    try:
        # Expecting "amount" (PHP pesos) and optional "coupon_code"
        amount_php = float(request.data.get("amount", 0))
        coupon_code = str(request.data.get("coupon_code", "") or "").upper()

        # Re‑apply business rule for coupon
        if coupon_code == "SAVE10":
            amount_php = amount_php * 0.9  # 10% off

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
        )

        return Response(
            {"clientSecret": payment_intent["client_secret"]},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print("Stripe error:", repr(e))  # DEBUG
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )
