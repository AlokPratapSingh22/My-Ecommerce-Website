import React, { useState, useEffect } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from 'react-router-dom';
import { Button, Table } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';

import { listUsers, deleteUser } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from '../components/Message';


function UserListScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete

    const userList = useSelector(state => state.userList)
    const { loading, error, users } = userList

    useEffect(() => {

        if (userInfo && userInfo.is_admin)
            dispatch(listUsers())
        else
            navigate('/login')
    }, [dispatch, navigate, userInfo, successDelete]);

    // Deletion
    const deleteHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(id));
        }
    }

    return (<div>
        <h1>Users</h1>
        {loading ? <Loader />
            : error ? (<Message variant='danger'>{error}</Message>)
                : (
                    <Table striped bordered hover responsive className='align-middle border-3 border-dark table-sm'>
                        <caption>List of Users</caption>
                        <thead className='table-dark'>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>ADMIN</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td align='center'>{user.is_admin ?
                                        (<i className='text-success fas fa-check'></i>)
                                        : (<i className='text-danger fas fa-times'></i>)
                                    }
                                    </td>
                                    <td align='center' className='px-0'>
                                        <LinkContainer to={`/admin/user/${user._id}/edit/`}>
                                            <Button type='link' className='bg-transparent btn-link p-0 link-dark mx-2'>
                                                <i className='fas fa-pen-alt'></i>
                                            </Button>
                                        </LinkContainer>
                                        <Button
                                            className='bg-transparent btn-link link-danger rounded-3 p-0 mx-2'
                                            onClick={() => deleteHandler(user._id)}
                                        >
                                            <i className='fas fa-trash-alt'></i>
                                        </Button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
    </div>);
}

export default UserListScreen;
