import React, { useState } from 'react';

import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer'
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";

function ShippingScreen() {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({
            address, city, postalCode, country
        }))
        navigate('/payment')
    }

    return (
        <div>
            <CheckoutSteps step1 step2 />
            <div className='shipping-bg'>
                <h2 className="font-poppins-bold text-center text-decoration-underline">Shipping</h2>
                <FormContainer>
                    <h3 className='ms-1 fs-4'>
                        Enter your <em>shipping address</em>-
                    </h3>
                    <Form
                        className='ms-3'
                        onSubmit={submitHandler}
                    >
                        <Form.Group controlId='address'>
                            <Form.Label className='mt-3 mb-0'>
                                <em>Address</em>
                            </Form.Label>
                            <Form.Control
                                className='mt-1'
                                required
                                type='text'
                                placeholder='Enter full address'
                                value={address ? address : ''}
                                onChange={(e) => setAddress(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='city'>
                            <Form.Label className='mt-1 mb-0'>
                                <em>City</em>
                            </Form.Label>
                            <Form.Control
                                className='mt-1'
                                required
                                type='text'
                                placeholder='Enter city'
                                value={city ? city : ''}
                                onChange={(e) => setCity(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='postalCode'>
                            <Form.Label className='mt-1 mb-0'>
                                <em>Postal Code</em>
                            </Form.Label>
                            <Form.Control
                                className='mt-1'
                                required
                                type='text'
                                placeholder='Enter postal code'
                                value={postalCode ? postalCode : ''}
                                onChange={(e) => setPostalCode(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='country'>
                            <Form.Label className='mt-1 mb-0'>
                                <em>Country</em>
                            </Form.Label>
                            <Form.Control
                                className='mt-1'
                                required
                                type='text'
                                placeholder='Enter country'
                                value={country ? country : ''}
                                onChange={(e) => setCountry(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Button type='submit' className='checkout mt-3 w-50 ms-3' value='Submit'>Continue</Button>
                    </Form>
                </FormContainer>
            </div >
        </div>
    );
}

export default ShippingScreen;
