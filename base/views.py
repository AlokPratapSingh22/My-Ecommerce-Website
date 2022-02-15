from datetime import datetime

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny

from rest_framework_simplejwt.views import TokenObtainPairView

from .pagination import DefaultPagination
from .models import Order, OrderItem, Product, Review, ShippingAddress
from .serializers import CreateReviewSerializer, OrderSerializer, ProductSerializer, MyTokenObtainPairSerializer, ReviewSerializer, UserSerializer, UserSerializerWithToken


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=str(data['name']),
            username=str(data['email']),
            email=data['email'].lower(),
            password=make_password(data['password']),
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except:
        return Response({'detail': 'User with credentials already exists'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request):
    user = request.user
    serializer = UserSerializerWithToken(
        user, many=False)

    data = request.data

    user.first_name = data['name']
    user.username = data['email'].lower()
    user.email = data['email'].lower()

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data, status=status.HTTP_205_RESET_CONTENT)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUserById(request, pk):
    user = User.objects.get(id=pk)
    data = request.data
    print(user)

    user.first_name = data['name']
    user.username = data['email'].lower()
    user.email = data['email'].lower()
    user.is_staff = data['is_admin']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data, status=status.HTTP_205_RESET_CONTENT)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        user = User.objects.get(id=request.user.id)

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def get_top_products(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:4]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


class ProductViewSet(ModelViewSet):
    pagination_class = DefaultPagination
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    http_method_names = ['get', 'post', 'delete']
    search_fields = ['name']
    filter_backends = [SearchFilter]

    def create(self, request, *args, **kwargs):

        user = request.user
        product = Product.objects.create(
            user=user,
            name='Sample Name',
            brand='Sample Brand',
            category='Sample Category',
            price=0.0,
            countInStock=0,
            description='',
            rating=0.0,
        )
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]


@api_view(['POST'])
def uploadImage(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()

    return Response('Image was uploaded')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No order items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # [TODO 1] Create order

        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice'],
        )

        # [TODO 2] Create shipping address

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )
        print('HERE')

        # [TODO 3] Create order items and set order to order item relation

        for i in orderItems:
            product = Product.objects.get(_id=i['product'])
            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url,
            )

            # [TODO 4] Update product stock

            product.countInStock -= item.qty
            print(product.countInStock)
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user: User = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):

    user = request.user
    try:
        order = Order.objects.get(_id=pk)

        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            Response({'detail': 'Not authorized to view this order'},
                     status=status.HTTP_401_UNAUTHORIZED)
    except Order.DoesNotExist:
        Response({'detail': 'Order does not exist'},
                 status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    try:
        order = Order.objects.get(_id=pk)

        order.isPaid = True
        order.paidAt = datetime.now()
        order.save()

        return Response('Order paid', status=status.HTTP_200_OK)

    except Order.DoesNotExist:
        Response({'detail': 'Order does not exist'},
                 status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        order.isDelivered = True
        order.deliveredAt = datetime.now()
        order.save()

        return Response(f'Order delivered at {order.deliveredAt}', status=status.HTTP_200_OK)

    except Order.DoesNotExist:
        Response({'detail': 'Order does not exist'},
                 status=status.HTTP_404_NOT_FOUND)


class ReviewViewSet(ModelViewSet):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        else:
            return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ReviewSerializer
        elif self.request.method == 'POST':
            return CreateReviewSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data
        print(kwargs['product_pk'])
        product = Product.objects.get(_id=kwargs['product_pk'])
        alreadyExists = product.reviews.filter(user=user).exists()
        if alreadyExists:
            content = {'detail': 'Product already reviewed'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        elif data['rating'] == 0:
            content = {'detail': 'Please select a rating'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

    def get_queryset(self):
        reviews = Review.objects.filter(product_id=self.kwargs['product_pk'])
        return reviews

    def get_serializer_context(self):
        return {'product_id': self.kwargs['product_pk'], 'user': self.request.user}
