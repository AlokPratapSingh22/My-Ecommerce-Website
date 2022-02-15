import React, { useEffect } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Table, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';

import { listProducts, deleteProduct, createProduct } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import Loader from "../components/Loader";
import Message from '../components/Message';
import Paginate from '../components/Paginate';


function ProductListScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

    const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList

    let keyword = location.search

    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })

        if (!userInfo.is_admin)
            navigate('/login')

        if (successCreate)
            navigate(`admin/product/${createdProduct._id}/edit/`)
        else
            dispatch(listProducts(keyword))

    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct, keyword]);

    // Deletion
    const deleteHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = () => {
        dispatch(createProduct())
    }

    return (<div>
        <Row className='align-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className='text-right'>
                <Button variant='light' className='my-3 btn-format btn-outline-primary' onClick={createProductHandler}>
                    Create Product
                </Button>
            </Col>
        </Row>

        {loadingDelete && <Loader />}
        {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

        {loadingCreate && <Loader />}
        {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

        {loading ? <Loader />
            : error ? (<Message variant='danger'>{error}</Message>)
                : (
                    <div>
                        <Table striped bordered hover responsive className='align-middle border-3 border-dark table-sm'>
                            <caption>List of Users</caption>
                            <thead className='table-dark'>
                                <tr>
                                    <th>ID</th>
                                    <th>TITLE</th>
                                    <th>PRICE</th>
                                    <th>CATEGORY</th>
                                    <th>BRAND</th>
                                    <th>QUANTITY</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>${product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        <td>{product.countInStock}</td>
                                        <td align='center' className='px-0'>
                                            <LinkContainer to={`/admin/product/${product._id}/edit/`}>
                                                <Button type='link' className='bg-transparent btn-link p-0 link-dark mx-2'>
                                                    <i className='fas fa-pen-alt'></i>
                                                </Button>
                                            </LinkContainer>
                                            <Button
                                                className='bg-transparent btn-link link-danger rounded-3 p-0 mx-2'
                                                onClick={() => deleteHandler(product._id)}
                                            >
                                                <i className='fas fa-trash-alt'></i>
                                            </Button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Paginate page={page} pages={pages} isAdmin={true} />
                    </div>
                )}
    </div>);
}

export default ProductListScreen;
