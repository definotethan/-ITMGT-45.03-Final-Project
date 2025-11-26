from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Order, OrderItem, CartItem

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = [
            'id', 'product_name', 'price', 'quantity', 'base_color', 
            'customization_text', 'design_image_url', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product_name', 'price', 'quantity', 'base_color',
            'customization_text', 'design_image_url'
        ]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    date = serializers.DateTimeField(source='created_at', format='%Y-%m-%d', read_only=True)
    total = serializers.DecimalField(source='final_amount', max_digits=10, decimal_places=2, read_only=True)

    # Add display for the (optional) discount and coupon fields
    discount = serializers.DecimalField(source='discount_amount', max_digits=10, decimal_places=2, read_only=True)
    coupon = serializers.CharField(source='coupon_code', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'total_amount', 'discount_amount', 'discount',
            'final_amount', 'total', 'coupon_code', 'coupon', 'status', 
            'payment_intent_id', 'items', 'date', 'created_at'
        ]
        read_only_fields = ['id', 'order_id', 'created_at']
