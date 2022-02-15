import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import Loader from "../components/Loader";
import Message from '../components/Message';

import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { getMyOrders } from "../actions/orderActions";

import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

function ProfileScreen() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)

    const { error, loading, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const listMyOrders = useSelector(state => state.listMyOrders)
    const { loading: loadingOrders, error: errorOrders, orders } = listMyOrders

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }
        else {
            if (!user || !user.name || success || userInfo._id !== user._id) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetails('profile'))
                dispatch(getMyOrders())
            }
            else {
                setName(user.name);
                setEmail(user.email);
            }
        }
    }, [dispatch, navigate, userInfo, user, success])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match')
        } else {
            dispatch(updateUserProfile({
                'id': user._id,
                'name': name,
                'email': email,
                'password': password
            }))
            setErrorMsg('')
        }

    }

    return (<Row className='w-100 m-0'>

        <Col lg={4} className='profile-left-side'>
            <div className='left-bg'>
            </div>
            <h2 className='font-poppins-bold'>User Profile</h2>
            {errorMsg && <Message variant='danger'>{errorMsg}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <div className='profile-content'>
                <Form onSubmit={submitHandler} className='update-form'>
                    <Form.Group controlId='name'>
                        <Form.Label className='mt-1'>
                            <strong><em>Name
                            </em></strong>
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
                        <Form.Label className='mt-1'>
                            <strong><em>Email
                            </em></strong>
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
                        <Form.Label className='mt-1'>
                            <strong><em>New Password
                            </em></strong>
                        </Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='confirm-password'>
                        <Form.Label className='mt-1'>
                            <strong><em>Confirm Password
                            </em></strong>
                        </Form.Label>
                        <Form.Control
                            required={password !== ''}
                            type='password'
                            placeholder='Enter password again'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>



                    <Button type='submit' variant='primary' className='update-btn'>
                        Update
                    </Button>

                </Form>
            </div>

        </Col>

        <Col lg={8} className='profile-right-side'>
            <div className='right-bg'></div>
            <h2>My Orders</h2>
            {loadingOrders ? <Loader />
                : errorOrders ? (
                    <Message variant='danger'>{errorOrders}</Message>
                ) : (
                    <Table striped bordered about='My Orders' responsive className='table-sm'>
                        <thead>
                            <tr className='bg-warning'>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map(order =>
                                <tr className='font-poppins' key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.split("T")[0]}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>
                                        {order.isPaid ?
                                            `${order.paidAt.split("T")[0]}::${order.paidAt.split("T")[1].substring(0, 5)}`
                                            : <i className='fas fa-times' style={{ color: 'orangered' }}></i>}
                                    </td>
                                    <td>
                                        {order.isDelivered ?
                                            `${order.deliveredAt.split("T")[0]}::${order.paidAt.split("T")[1].substring(0, 5)}`
                                            : 'Not Delivered'}
                                    </td>

                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className='btn rounded-3 fw-normal btn-warning py-0 text-transform-none btn-sm'>Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            )}
                            {orders.length == 0 &&
                                <tr key={0}>
                                    <td align='center'>-</td>
                                    <td align='center'>-</td>
                                    <td align='center'>-</td>
                                    <td align='center'>-</td>
                                    <td align='center'>-</td>
                                    <td align='center'>-</td>

                                </tr>}
                        </tbody>
                    </Table>
                )}
        </Col>
    </Row>);

}

export default ProfileScreen;
