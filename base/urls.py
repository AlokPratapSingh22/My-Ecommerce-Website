from django.urls import path
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
# product urls
router.register('products', views.ProductViewSet,
                basename='products')
# users urls
router.register('users', views.UserViewSet, basename='users')

products_router = routers.NestedDefaultRouter(
    router, 'products', lookup='product')
products_router.register('reviews', views.ReviewViewSet,
                         basename='product-reviews')

urlpatterns = [
    # user auth urls
    path('users/login/', views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('users/register/', views.registerUser,  name='user-register'),
    path('users/profile/update/', views.updateUser,  name='user-profile-update'),
    path('users/update/<str:pk>/', views.updateUserById,  name='user-update'),

    path('product/update/<str:pk>/', views.updateProduct, name="product-update"),
    path('products/top/', views.get_top_products, name="product-top"),
    path('product/upload-image/', views.uploadImage, name="upload-image"),

    # order urls
    path('orders/', views.getOrders,  name='orders'),
    path('orders/add/', views.addOrderItems,  name='add-orders'),
    path('orders/my-orders/', views.getMyOrders,  name='my-orders'),
    path('orders/<str:pk>/', views.getOrderById,  name='user-order'),
    path('orders/<str:pk>/pay/', views.updateOrderToPaid,  name='pay-order'),
    path('orders/<str:pk>/deliver/',
         views.updateOrderToDelivered,  name='deliver-order'),
]

urlpatterns += router.urls + products_router.urls
