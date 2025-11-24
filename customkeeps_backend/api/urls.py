from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, ProductViewSet, OrderViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import pay_view

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
    path('checkout/pay/', pay_view, name='checkout-pay'),
]