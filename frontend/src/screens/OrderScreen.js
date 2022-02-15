import React, { useEffect, useState } from 'react';
import { Row, Col, Button, ListGroup, Image, Card } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { PayPalButton } from "react-paypal-button-v2";
import GooglePayButton from "@google-pay/button-react";
import { Link, useParams } from 'react-router-dom';
import { TAX_RATE, ORDER_PAY_RESET, ORDER_DELIVER_RESET } from "../constants/orderConstants";

import { getOrderDetails, payOrder, deliverOrder } from "../actions/orderActions";

import Loader from "../components/Loader";
import Message from '../components/Message';

function OrderScreen() {


    const { id: orderId } = useParams()
    // const navigate = useNavigate()
    const dispatch = useDispatch()
    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { success: successPay, loading: loadingPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { success: successDelivered, loading: loadingDelivered } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    // Adding paypal scripts
    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=Ab_K7vl2pFGVj6S0_zxbtUAK04xMj1CIBOZnxYqgSvSYJ09dqk4npXAVeWZfFgHOOpo2g2axgJ9QRgYb&currency=USD'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    useEffect(() => {
        if (!order || successPay || successDelivered || order._id !== Number(orderId)) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
            }
            else {
                setSdkReady(true)
            }
        }
    }, [order, orderId, dispatch, successPay, successDelivered]);

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    }

    const successDeliverHandler = () => {
        dispatch(deliverOrder(order))
    }


    return (
        loading ? (<Loader />)
            : error ?
                (<Message variant='danger'>{error}</Message>)
                : <div>
                    <div className='shipping-bg'>
                        <h2 className="font-poppins-bold text-center text-decoration-underline">Order Details</h2>
                        <Row>
                            <Col lg={8}>
                                <ListGroup variant='flush' className='place-order-detail'>
                                    <ListGroup.Item className='place-order-detail-item'>
                                        <h2>Shipping</h2>
                                        <p>
                                            <strong>Name: </strong> {order.user.name}
                                        </p>
                                        <p>
                                            <strong>Email: </strong> <a href={`mailto:${order.user.email}`} className='btn-link text-decoration-none'>{order.user.email}</a>
                                        </p>
                                        <p>
                                            <strong>Shipping Address: </strong>
                                            {order.shippingAddress.address}, {order.shippingAddress.city}
                                            {' '}{order.shippingAddress.postalCode},
                                            {' '}{order.shippingAddress.country}.
                                        </p>
                                        {order.isDelivered ? (
                                            <Message variant='success'>
                                                Delivered on {order.deliveredAt.split("T")[0]} at {order.deliveredAt.split("T")[1].substring(0, 8)}
                                            </Message>
                                        )
                                            : (
                                                <Message variant='warning'>Not Delevired</Message>
                                            )
                                        }
                                    </ListGroup.Item>

                                    <ListGroup.Item className='place-order-detail-item'>
                                        <h2>Payment Method</h2>
                                        <p>
                                            <strong>Payment Method: </strong>
                                            {order.paymentMethod}
                                        </p>
                                        {order.isPaid ? (
                                            <Message variant='success'>Paid on {order.paidAt.split("T")[0]} at {order.paidAt.split("T")[1].substring(0, 8)}</Message>
                                        )
                                            : (
                                                <Message variant='warning'>Not Paid</Message>
                                            )
                                        }
                                    </ListGroup.Item>

                                    <ListGroup.Item className='place-order-detail-item'>
                                        <h2>Order Items</h2>
                                        {order.orderItems.length === 0 ?
                                            <Message variant='info'>
                                                No Orders.
                                            </Message>
                                            : (
                                                <ListGroup variant='flush'>
                                                    {order.orderItems.map((item, index) => (
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
                                                <Col>${order.itemsPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>

                                        <ListGroup.Item className='place-order-detail-item'>
                                            <Row>
                                                <Col className='font-poppins'>Shipping:</Col>
                                                <Col>+{' '}${order.shippingPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>

                                        <ListGroup.Item className='place-order-detail-item'>
                                            <Row>
                                                <Col className='font-poppins'>Tax:</Col>
                                                <Col>+{' '}${order.taxPrice}{' '}(@{(TAX_RATE * 100).toFixed(2)}%)</Col>
                                            </Row>
                                        </ListGroup.Item>

                                        <ListGroup.Item className='place-order-detail-item fw-bold'>
                                            <Row>
                                                <Col className='font-poppins'>Total:</Col>
                                                <Col>${order.totalPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {!order.isPaid && userInfo._id == order.user._id &&
                                            <ListGroup.Item className='place-order-detail-item fw-bold'>
                                                {loadingPay && <Loader />}
                                                {!sdkReady ? (<Loader />)
                                                    :
                                                    <div className='text-center'>
                                                        <GooglePayButton
                                                            environment='TEST'
                                                            className='mb-3'
                                                            buttonSizeMode='fill'
                                                            paymentRequest={{
                                                                apiVersion: 2,
                                                                apiVersionMinor: 0,
                                                                allowedPaymentMethods: [
                                                                    {
                                                                        type: 'CARD',
                                                                        parameters: {
                                                                            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                                                            allowedCardNetworks: ['MASTERCARD', 'MAESTRO', 'VISA'],
                                                                        },
                                                                        tokenizationSpecification: {
                                                                            type: 'PAYMENT_GATEWAY',
                                                                            parameters: {
                                                                                gateway: 'example',
                                                                                gatewayMerchantId: 'exampleGatewayMerchantId',
                                                                            },
                                                                        }
                                                                    }
                                                                ],
                                                                merchantInfo: {
                                                                    merchantId: '12345678901234567890',
                                                                    merchantName: 'Demo Merchant',
                                                                },
                                                                transactionInfo: {
                                                                    totalPriceStatus: 'FINAL',
                                                                    totalPriceLabel: 'Total',
                                                                    totalPrice: order.totalPrice,
                                                                    currencyCode: 'USD',
                                                                    countryCode: 'US',
                                                                }
                                                            }}

                                                            onLoadPaymentData={successPaymentHandler}
                                                        />
                                                        <PayPalButton
                                                            style={{
                                                                layout: 'vertical',
                                                                color: 'blue',
                                                                shape: 'rect',
                                                                label: 'paypal'
                                                            }}
                                                            amount={order.totalPrice}
                                                            onSuccess={successPaymentHandler}
                                                        />
                                                    </div>
                                                }

                                            </ListGroup.Item>
                                        }

                                    </ListGroup>
                                    {loadingDelivered && <Loader />}
                                    {userInfo && userInfo.is_admin && order.isPaid && !order.isDelivered && (
                                        <ListGroup>

                                            <ListGroup.Item className='place-order-detail-item text-center'>
                                                <Button
                                                    type='button'
                                                    className='btn btn-group-lg btn-format'
                                                    onClick={successDeliverHandler}
                                                >
                                                    Mark as delivered
                                                </Button>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    )}
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>);
}


export default OrderScreen;


