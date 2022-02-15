import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Image, Button, Form, Card, ListGroup } from 'react-bootstrap';
import { listProductDetails, createProductReview } from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from '../components/Rating';


function ProductScreen() {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    let { id } = useParams()
    let navigate = useNavigate()

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const createReview = useSelector(state => state.productCreateReview)
    const { loading: loadingReview, error: errorReview, success: successReview } = createReview

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(id, {
            rating, comment
        }))
        console.log(errorReview);
    }


    // loads every time there is a trigger
    useEffect(() => {
        if (successReview) {
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }
        // making our api call here
        dispatch(listProductDetails(id))

    }, [dispatch, id, successReview]);

    const addToCartHandler = () => {
        navigate(`/cart/${id}/?qty=${qty}`)
    }

    return <div>
        <Link to='/'><i className='fas fa-arrow-left back-btn'></i></Link>
        <h1 className='font-poppins-bold text-center'>Product Details</h1>
        <div className="bg-effect"></div>

        {loading ?
            <Loader />
            : error ?
                <Message variant={'danger'}>{error}</Message>
                : (
                    <div>
                        <Card className='product-detail'>
                            <Card.Body>
                                <Row>
                                    <Col md={4} className='product-values'>
                                        <h1 className='product-name'>{product.name}</h1>
                                        <p className='description'> {product.description}</p>
                                    </Col>
                                    <Col md={4}>
                                        <div>
                                            <Image src={product.image} alt={product.name} className='product-image' />
                                        </div>
                                    </Col>
                                    <Col md={4} className='product-values'>

                                        <p>
                                            <strong>Review:</strong> <Rating value={product.rating} color='#FDC20C' text={`${product.numReviews} reviews`} />
                                        </p>
                                        <p>
                                            <strong>Status:</strong> <span className='fs-4 fw-bold text-black-50'>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                                        </p>

                                        {product.countInStock > 0 && (
                                            <div>
                                                <p>
                                                    <strong>
                                                        Quantity:
                                                    </strong>

                                                    <Form.Control
                                                        className='text-center w-25 d-inline ms-2 count-selector'
                                                        as='select'

                                                        value={qty}
                                                        onChange={
                                                            (e) => setQty(e.target.value)
                                                        }>
                                                        {
                                                            [...Array(product.countInStock).keys()].map((x) =>
                                                            (<option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>)
                                                            )
                                                        }
                                                    </Form.Control>
                                                </p>

                                            </div>
                                        )}
                                        <Button
                                            onClick={
                                                addToCartHandler
                                            }
                                            className='add-to-cart'
                                            disabled={product.countInStock === 0}
                                            variant='primary'

                                        >
                                            Add to Cart
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card >
                        <hr />
                        <Row>
                            <Col md={6}>
                                <h4 className='text-decoration-underline font-poppins-bold'>Reviews-{'\t'}{product.reviews.length}</h4>
                                {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}
                                <ListGroup variant='flush'>
                                    {product.reviews.map((review) => (
                                        <ListGroup.Item key={review._id} className='rounded-2 mt-3 bg-light-50'>
                                            <strong>{review.name}</strong>{'    '}
                                            <Rating value={review.rating} color='#f8a825' />
                                            <p className='fs-6'>{review.createdAt.split("T")[0]}</p>
                                            <p className='fs-5'>{review.comment}</p>
                                        </ListGroup.Item>)
                                    )}
                                    <hr />
                                    <ListGroup.Item className='mt-2 bg-light-50'>
                                        <h4 className='text-decoration-underline'>Write a review</h4>
                                        {loadingReview && <Loader />}
                                        {errorReview && <Message variant='danger'>{errorReview}</Message>}
                                        {successReview && <Message variant='success'>Review Submitted</Message>}
                                        {userInfo && !errorReview ?
                                            (<Form onSubmit={submitHandler}>
                                                <Form.Group id='rating'>
                                                    <Form.Label>
                                                        Rating
                                                    </Form.Label>
                                                    <Form.Control
                                                        className='w-auto mt-1'
                                                        as='select'
                                                        value={rating}
                                                        onChange={(e) => setRating(e.target.value)}
                                                    >
                                                        <option value=''>Select...</option>
                                                        <option value='1'>1 - Bad</option>
                                                        <option value='2'>2 - Fine</option>
                                                        <option value='3'>3 - Good</option>
                                                        <option value='4'>4 - Satisfied</option>
                                                        <option value='5'>5 - Excellent</option>
                                                    </Form.Control>
                                                </Form.Group>

                                                <Form.Group id='comment'>
                                                    <Form.Label>Comment</Form.Label>
                                                    <Form.Control
                                                        as='textarea'
                                                        rows={5}
                                                        className='rounded-0 mt-2'
                                                        placeholder='comment'
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                    >
                                                    </Form.Control>
                                                </Form.Group>

                                                <Button className='mt-3 checkout text-transform-none w-auto py-2'
                                                    disabled={loadingReview}
                                                    type='submit'
                                                >Submit</Button>
                                            </Form>)
                                            : <Message variant='info'>Please <Link to='/login'>Login</Link></Message>}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </div>
                )
        }
    </div >;
}

export default ProductScreen;