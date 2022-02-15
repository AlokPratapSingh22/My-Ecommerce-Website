import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';

import Loader from "../components/Loader";
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';

import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";

function UserEditScreen() {

    const { id: userId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState('')


    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = userUpdate

    useEffect(() => {

        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET })
            navigate('/admin/user-list/')
        }
        else {

            if (!user.name || user._id !== Number(userId))
                dispatch(getUserDetails(userId))
            else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.is_admin)
            }
        }
    }, [userId, dispatch, user, navigate, successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ _id: user._id, name, email, is_admin: isAdmin }))
    }

    return (
        <div>
            <Link to='/admin/user-list/'><i className='fas fa-arrow-left back-btn'></i></Link>
            <FormContainer>

                <h1 className='font-poppins-bold'>Edit User</h1>

                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading ? <Loader />
                    : error ? <Message variant='danger'>{error}</Message>
                        : <Form onSubmit={submitHandler} className='login-form'>
                            <Form.Group controlId='name' className='mt-2'>
                                <Form.Label>
                                    <em>Name</em>:
                                </Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter full name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='email' className='mt-2'>
                                <Form.Label>
                                    <em>Email Address</em>:
                                </Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='Enter Email address'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='is-admin' className='mt-2'>
                                <Form.Check
                                    type='checkbox'
                                    label='Is Admin?'
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                >
                                </Form.Check>
                            </Form.Group>


                            <Button
                                type='submit' variant='primary' className='update-btn'
                                onClick={submitHandler}
                            >
                                Update
                            </Button>

                        </Form>
                }
            </FormContainer>
        </div>);
}


export default UserEditScreen;
