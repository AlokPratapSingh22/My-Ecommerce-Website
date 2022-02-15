import React, { useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { listProductDetails } from "../actions/productActions";


import Rating from './Rating';


function Product({ product }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        // making our api call here
        dispatch(listProductDetails(product._id))

    }, [dispatch, product]);

    const addToCartHandler = () => {
        navigate(`/cart/${product._id}/?qty=1`)
    }

    return <Card className='my-3 p-3 product-card dotted-bg'>
        <Link to={`/product/${product._id}`} params={product._id}>
            <Card.Img src={product.image} />
        </Link>
        <Card.Body>
            <Link to={`/product/${product._id}`} className='text-decoration-none btn-link'>
                <Card.Title as='div' className='text-center'>
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>
            <Card.Text as='div'>
                <div >
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                </div>
            </Card.Text>
            <Card.Text as='h3' className='text-center py-0'>
                ${product.price}
            </Card.Text>

            <Button variant='outline-danger'
                onClick={
                    addToCartHandler
                }
                disabled={product.countInStock === 0}
                size='md'
                className='py-0 rounded-pill w-100'>
                <Row className='w-100'>
                    <Col md={3} className='m-0'>
                        <i className="fas fa-shopping-cart"></i>{'  '}
                    </Col>
                    <Col md={9}>
                        Add to Cart
                    </Col>
                </Row>
            </Button>

        </Card.Body>
    </Card >;
}


export default Product;

