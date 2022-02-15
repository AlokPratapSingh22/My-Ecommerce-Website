import React, { useState, useEffect } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from 'react-router-dom';
import { Button, Table } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';

import { getOrders } from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from '../components/Message';


function OrderListScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin


    const orderList = useSelector(state => state.listOrders)
    const { loading, error, orders } = orderList

    useEffect(() => {

        if (userInfo && userInfo.is_admin)
            dispatch(getOrders())
        else
            navigate('/login')
    }, [dispatch, navigate, userInfo]);

    // Deletion
    const deleteHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {

        }
    }

    return (<div>
        <h1>Orders</h1>
        {loading ? <Loader />
            : error ? (<Message variant='danger'>{error}</Message>)
                : (
                    <Table striped bordered hover responsive className='align-middle border-3 border-dark table-sm'>
                        <caption>List of Orders</caption>
                        <thead className='table-dark'>
                            <tr>
                                <th>ID</th>
                                <th>USER</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.user && order.user.name}</td>
                                    <td>{order.createdAt.split("T")[0]}</td>
                                    <td>${order.totalPrice}</td>
                                    <td align='center'>{order.isPaid ?
                                        order.paidAt.split("T")[0]
                                        : (<i className='text-danger fas fa-times'></i>)
                                    }
                                    </td>
                                    <td align='center'>{order.isDelivered ?
                                        order.deliveredAt.split("T")[0]
                                        : (<i className='text-danger fas fa-times'></i>)
                                    }
                                    </td>
                                    <td align='center' className='px-0'>
                                        <LinkContainer to={`/order/${order._id}/`}>
                                            <Button type='link' className='bg-transparent btn-link p-0 link-dark mx-2'>
                                                <i className='fas fa-info-circle fs-2'></i>
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
    </div>);
}

export default OrderListScreen;
