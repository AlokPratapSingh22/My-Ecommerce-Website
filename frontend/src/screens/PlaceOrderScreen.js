import React, { useEffect } from 'react';
import { Row, Button, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { TAX_RATE, ORDER_CREATE_RESET } from '../constants/orderConstants'

import { createOrder } from "../actions/orderActions";

import CheckoutSteps from "../components/CheckoutSteps";
import Message from '../components/Message';

function PlaceOrderScreen() {
    const cart = useSelector(state => state.cart)

    const orderCreate = useSelector(state => state.createOrder)
    const { order, error, success } = orderCreate

    cart.itemsPrice = Number(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2))
    cart.shippingPrice = Number((cart.itemsPrice > 100 ? 0 : 10).toFixed(2))
    cart.taxPrice = Number((cart.itemsPrice * TAX_RATE).toFixed(2))
    cart.totalPrice = Number((cart.itemsPrice + cart.shippingPrice + cart.taxPrice).toFixed(2))

    const navigate = useNavigate()
    const dispatch = useDispatch()

    if (!cart.paymentMethod) {
        navigate('/payment')
    }

    useEffect(() => {
        if (success) {
            navigate(`/order/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET })
        }

    }, [success, navigate, order, dispatch]);


    const placeOrder = (e) => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            shippingPrice: cart.shippingPrice,
            itemsPrice: cart.itemsPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        }))
    }

    return (<div>
        <CheckoutSteps step1 step2 step3 step4 />
        <div className='shipping-bg'>
            <h2 className="font-poppins-bold text-center text-decoration-underline">Place Order</h2>
            <Row>
                <Col lg={8}>
                    <ListGroup variant='flush' className='place-order-detail'>
                        <ListGroup.Item className='place-order-detail-item'>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Shipping Address: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}
                                {' '}{cart.shippingAddress.postalCode},
                                {' '}{cart.shippingAddress.country}.
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item className='place-order-detail-item'>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Payment Method: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item className='place-order-detail-item'>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ?
                                <Message variant='info'>
                                    Your cart is empty.
                                </Message>
                                : (
                                    <ListGroup variant='flush'>
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroup.Item key={index} className='place-order-detail-item'>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} rounded fluid />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`} className='font-poppins text-decoration-none'>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} X ${item.price} = $<em>{(item.price * item.qty).toFixed(2)}</em>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                        </ListGroup.Item>

                    </ListGroup>
                </Col>
                <Col lg={4} >

                    <Card className='order-summary'>
                        <ListGroup variant='flush'>
                            <ListGroup.Item className='place-order-detail-item'>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item className='place-order-detail-item'>
                                <Row>
                                    <Col className='font-poppins'>Item:</Col>
                                    <Col>${cart.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item className='place-order-detail-item'>
                                <Row>
                                    <Col className='font-poppins'>Shipping:</Col>
                                    <Col>+{' '}${cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item className='place-order-detail-item'>
                                <Row>
                                    <Col className='font-poppins'>Tax:</Col>
                                    <Col>+{' '}${cart.taxPrice}{' '}(@{(TAX_RATE * 100).toFixed(2)}%)</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item className='place-order-detail-item fw-bold'>
                                <Row>
                                    <Col className='font-poppins'>Total:</Col>
                                    <Col>${cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item className='place-order-detail-item'>
                                {error && <Message variant='danger'>{error}</Message>}
                            </ListGroup.Item>

                            <ListGroup.Item className='place-order-detail-item text-center'>
                                <Button type='button'
                                    className='btn-block w-100 checkout'
                                    disabled={cart.cartItems.length === 0}
                                    onClick={placeOrder}
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    </div>);
}

export default PlaceOrderScreen;
