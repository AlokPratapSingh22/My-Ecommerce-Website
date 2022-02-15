from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Product(models.Model):
    _id = models.AutoField(editable=False, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, default='')
    brand = models.CharField(max_length=200, blank=True, null=True)
    category = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, validators=[
                                 MinValueValidator(0), MaxValueValidator(5)], default=0)
    numReviews = models.IntegerField(null=True,
                                     default=0, validators=[MinValueValidator(0)])
    price = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, default=0.0)
    countInStock = models.IntegerField(null=True,
                                       default=0, validators=[MinValueValidator(0)])
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name


class Review(models.Model):
    _id = models.AutoField(editable=False, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True, validators=[
                                 MinValueValidator(0), MaxValueValidator(5)], default=0)
    comment = models.TextField(blank=True, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return str(self.rating)


class Order(models.Model):
    _id = models.AutoField(editable=False, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200)
    paymentMethod = models.CharField(max_length=200)
    taxPrice = models.DecimalField(max_digits=8, decimal_places=2, null=False)
    shippingPrice = models.DecimalField(
        max_digits=8, decimal_places=2, null=False)
    totalPrice = models.DecimalField(
        max_digits=8, decimal_places=2, null=False)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(
        auto_now_add=False, blank=True, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return str(self.createdAt)


class OrderItem(models.Model):
    _id = models.AutoField(editable=False, primary_key=True)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE)
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=200)
    qty = models.IntegerField(default=0, null=True, blank=True)
    price = models.DecimalField(
        max_digits=8, decimal_places=2, null=False)
    image = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self) -> str:
        return str(self.name)


class ShippingAddress(models.Model):
    _id = models.AutoField(editable=False, primary_key=True)
    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, null=True, blank=True, related_name='address')
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=8, decimal_places=2, null=True)

    def __str__(self) -> str:
        return self.address
