import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';

import Loader from "../components/Loader";
import Message from '../components/Message';


import { register } from "../actions/userActions";

function RegisterScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const navigate = useNavigate()
    const location = useLocation()

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const dispatch = useDispatch()

    const userRegister = useSelector(state => state.userRegister)
    const { error, loading, userInfo } = userRegister

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match')
        }
        else {
            dispatch(register(name, email.toLowerCase(), password))
        }

    }

    return (<Row className='login-container sign-in-container d-flex flex-row justify-content-center align-items-md-center'>
        {errorMsg && <Message variant='danger'>{errorMsg}</Message>}
        <Col md={4} className='left-side'>
            <h1 className='font-poppins-bold'>SignUp</h1>
            <p>Get access to your Orders, Wishlist and Recommendations</p>
        </Col>
        <Col md={8} className='right-side'>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler} className='login-form'>
                <Form.Group controlId='name'>
                    <Form.Label>
                        What's your <em>name</em>?
                    </Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder='Enter full name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='email'>
                    <Form.Label>
                        What's your <em>Email Address</em>?
                    </Form.Label>
                    <Form.Control
                        required
                        type='email'
                        placeholder='Enter Email address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='confirm-password'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='Enter password again'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>



                <Button type='submit' variant='primary' className='login-btn'>
                    SignUp
                </Button>

            </Form>

            <p className='py-3'>

                Have an account?
                <Link to={redirect ? `/login/?redirect=${redirect}` : '/login'} className='or-register text-decoration-none'>
                    <strong>Login</strong>
                </Link>

            </p>
        </Col>
    </Row >);
}

export default RegisterScreen;