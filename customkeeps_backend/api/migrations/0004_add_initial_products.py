from django.db import migrations


def add_products(apps, schema_editor):
    Product = apps.get_model('api', 'Product')
    
    products = [
        {
            'name': 'Custom T-Shirt',
            'price': 500.00,
            'description': 'Wear your story with personalized designs.'
        },
        {
            'name': 'Custom Mug',
            'price': 300.00,
            'description': 'Perfect for hot drinks and gifting.'
        },
        {
            'name': 'Custom Tote Bag',
            'price': 400.00,
            'description': 'Eco-friendly and stylish for your daily needs.'
        }
    ]
    
    for product_data in products:
        Product.objects.get_or_create(**product_data)


def remove_products(apps, schema_editor):
    Product = apps.get_model('api', 'Product')
    Product.objects.filter(
        name__in=['Custom T-Shirt', 'Custom Mug', 'Custom Tote Bag']
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_cartitem_base_color_and_more'),  # ✅ FIXED!
    ]

    operations = [
        migrations.RunPython(add_products, remove_products),
    ]
