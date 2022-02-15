from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Order, OrderItem, Product, Review, ShippingAddress

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# authentication jwt


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data

        for key, val in serializer.items():
            data[key] = val
        return data


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    _id = serializers.SerializerMethodField(read_only=True)
    is_admin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'is_admin']

    def get__id(self, user: User):
        return user.id

    def get_is_admin(self, user: User):
        return user.is_staff

    def get_name(self, user: User):
        name = user.first_name.strip()
        if name == '':
            return user.email
        return name


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username',
                  'email', 'name', 'is_admin', 'token']

    def get_token(self, user: User):
        token = RefreshToken.for_user(user)
        return str(token.access_token)


class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_reviews(self, product: Product):
        reviews = product.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data


class CreateReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['_id', 'user', 'name', 'rating', 'comment']

    def create(self, validated_data):
        product_id = self.context['product_id']
        product = Product.objects.get(_id=product_id)
        user = self.context['user']
        reviews = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=validated_data['rating'],
            comment=validated_data['comment'],
        )
        reviews = Review.objects.filter(product_id=product_id)
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating
        product.rating = total / len(reviews)
        product.save()

        return reviews


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.items.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(
                obj.address, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data
