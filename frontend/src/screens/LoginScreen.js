import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';

import Loader from "../components/Loader";
import Message from '../components/Message';
// import FormContainer from '../components/FormContainer';

import { login } from "../actions/userActions";

function LoginScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const location = useLocation()

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))

    }

    return (
        <Row className='login-container d-flex flex-row justify-content-center align-items-md-center'>
            <Col md={4} className='left-side'>
                <h1 className='font-poppins-bold'>LogIn</h1>
                <p>Get access to your Orders, Wishlist and Recommendations</p>
            </Col>
            <Col md={8} className='right-side'>
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler} className='login-form'>
                    <Form.Group>
                        <Form.Label>
                            What's your <em>Email Address</em>?
                        </Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter Email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>



                    <Button type='submit' variant='primary' className='login-btn'>
                        LogIn
                    </Button>

                </Form>

                <p className='py-3'>

                    New Customer?
                    <Link to={redirect ? `/register/?redirect=${redirect}` : '/register'} className='or-register text-decoration-none'>
                        <strong>Register</strong>
                    </Link>

                </p>

            </Col>

        </Row>
    );
}

export default LoginScreen;