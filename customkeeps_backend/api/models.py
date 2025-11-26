from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)
    base_color = models.CharField(max_length=50, default='White')
    customization_text = models.TextField(blank=True, null=True)
    design_image_url = models.TextField(default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.product_name}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('preparing', 'Preparing'),
        ('ready_for_delivery', 'Ready for Delivery'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_id = models.CharField(max_length=50, unique=True, default='TEMP')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    coupon_code = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='preparing')
    payment_intent_id = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.order_id} - {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    base_color = models.CharField(max_length=50, default='White')
    customization_text = models.TextField(blank=True, null=True)
    design_image_url = models.TextField(default='')

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

class Coupon(models.Model):
    code = models.CharField(max_length=32, unique=True)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, help_text="Percent, like 10 for 10%")
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.code} ({self.discount_percent}%)"