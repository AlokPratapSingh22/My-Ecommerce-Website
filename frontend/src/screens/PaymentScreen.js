import React, { useState } from 'react';

import { Form, Button, Col } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer'
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

function PaymentScreen() {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    if (!shippingAddress.address) {
        navigate('/shipping')
    }

    const onSubmitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeOrder')
    }

    return (<div>
        <CheckoutSteps step1 step2 step3 />
        <div className='shipping-bg'>
            <h2 className="font-poppins-bold text-center text-decoration-underline">Payment Method</h2>
            <FormContainer>
                <Form onSubmit={onSubmitHandler}>
                    <Form.Group>
                        <Form.Label as='legend' className='h3'>Select Method</Form.Label>
                        <Col>
                            <Form.Check
                                type='radio'
                                label='PayPal or Credit Card'
                                id='PayPal'
                                name='paymentMethod'
                                checked
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            ></Form.Check>
                        </Col>
                        <Col>
                            <Form.Check
                                type='radio'
                                label='Google Pay'
                                id='GPay'
                                name='paymentMethod'
                                onChange={(e) => setPaymentMethod('GPay')}
                            ></Form.Check>
                        </Col>
                    </Form.Group>

                    <Button type='submit' className='checkout mt-3 w-50 ms-3' value='Submit'>Continue</Button>

                </Form>
            </FormContainer>
        </div>
    </div>);
}

export default PaymentScreen;
