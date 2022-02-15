import React from 'react';
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function CheckoutSteps({ step1, step2, step3, step4 }) {
    return (
        <Nav className='checkout-container mb-4 p-0'>
            <Nav.Item className='checkout-step mx-auto'>
                {step1 ? (
                    <LinkContainer to='/login'>
                        <Nav.Link className='checkout-link checkout-step-done'>Login</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link className='checkout-link' disabled>Login</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item className='checkout-step mx-auto'>
                {step2 ? (
                    <LinkContainer to='/shipping'>
                        <Nav.Link className='checkout-link checkout-step-done'>Add Address</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link className='checkout-link' disabled>Add Address</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item className='checkout-step mx-auto'>
                {step3 ? (
                    <LinkContainer to='/payment'>
                        <Nav.Link className='checkout-link checkout-step-done'>Payment</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link className='checkout-link' disabled>Payment</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item className='checkout-step mx-auto'>
                {step4 ? (
                    <LinkContainer to='/placeOrder'>
                        <Nav.Link className='checkout-link checkout-step-done'>Place Order</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link className='checkout-link' disabled>Place Order</Nav.Link>
                )}
            </Nav.Item>
        </Nav>);
}

export default CheckoutSteps;
