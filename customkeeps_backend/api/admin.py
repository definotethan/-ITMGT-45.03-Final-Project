from django.contrib import admin
from django.utils.html import format_html
from .models import Product, CartItem, Order, OrderItem, Coupon

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'description']
    search_fields = ['name']


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'product_name', 'quantity', 'base_color', 'image_preview', 'created_at']
    list_filter = ['created_at', 'base_color']
    search_fields = ['user__username', 'product_name']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        """Display thumbnail of design image"""
        if obj.design_image_url:
            return format_html(
                '<img src="{}" style="max-width: 100px; max-height: 100px; border-radius: 8px;" />',
                obj.design_image_url
            )
        return "No image"
    
    image_preview.short_description = 'Design Preview'


# Inline admin for OrderItems (shows items within an order)
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'price', 'quantity', 'base_color', 'customization_text', 'image_preview']
    can_delete = False
    
    def image_preview(self, obj):
        """Display thumbnail of design image in inline"""
        if obj.design_image_url:
            return format_html(
                '<img src="{}" style="max-width: 80px; max-height: 80px; border-radius: 4px;" />',
                obj.design_image_url
            )
        return "No image"
    
    image_preview.short_description = 'Design'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'user', 'final_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_id', 'user__username']
    readonly_fields = ['order_id', 'created_at', 'updated_at', 'payment_intent_id']
    inlines = [OrderItemInline]  # Show order items inside order detail page
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_id', 'user', 'status')
        }),
        ('Payment Details', {
            'fields': ('total_amount', 'discount_amount', 'final_amount', 'coupon_code', 'payment_intent_id')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'quantity', 'price', 'base_color', 'image_preview']
    list_filter = ['product_name', 'base_color']
    search_fields = ['order__order_id', 'product_name']
    readonly_fields = ['image_preview_large']

    def image_preview(self, obj):
        """Display small thumbnail in list view"""
        if obj.design_image_url:
            return format_html(
                '<img src="{}" style="max-width: 60px; max-height: 60px; border-radius: 4px;" />',
                obj.design_image_url
            )
        return "No image"
    
    image_preview.short_description = 'Design'

    def image_preview_large(self, obj):
        """Display larger image in detail view"""
        if obj.design_image_url:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 300px; border-radius: 8px; border: 2px solid #ddd;" />',
                obj.design_image_url
            )
        return "No image"
    
    image_preview_large.short_description = 'Design Preview'

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_percent', 'valid_from', 'valid_to', 'active']
    search_fields = ['code']
    list_filter = ['active', 'valid_from', 'valid_to']