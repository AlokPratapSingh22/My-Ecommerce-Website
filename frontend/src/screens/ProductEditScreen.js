import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';

import Loader from "../components/Loader";
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';

import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

function ProductEditScreen() {

    const { id: productId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)


    const productDetails = useSelector(state => state.productDetails)
    const { error, loading, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = productUpdate

    useEffect(() => {

        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            navigate('/admin/product-list/')
        }
        else {

            if (!product.name || product._id !== Number(productId))
                dispatch(listProductDetails(productId))
            else {
                setName(product.name)
                setBrand(product.brand)
                setImage(product.image)
                setDescription(product.description)
                setCategory(product.category)
                setPrice(product.price)
                setCountInStock(product.countInStock)
            }
        }
    }, [productId, dispatch, product, navigate, successUpdate])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()

        formData.append('image', file)
        formData.append('product_id', productId)

        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }

            const { data } = await axios.post('/api/product/upload-image/', formData, config)


            setImage(data)
            setUploading(false)

        } catch (error) {
            setUploading(false)
        }
    }


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description,
        }))
    }


    return (
        <div>
            <Link to='/admin/product-list/'><i className='fas fa-arrow-left back-btn'></i></Link>
            <FormContainer>

                <h1 className='edit-form text-center font-poppins-bold'>Edit Product</h1>

                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading ? <Loader />
                    : error ? <Message variant='danger'>{error}</Message>
                        : <Form onSubmit={submitHandler} className='edit-form'>
                            <Form.Group controlId='name'>
                                <Form.Label className='mt-2'>
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

                            <Form.Group >
                                <Form.Label className='mt-2'>
                                    <em>Image</em>:
                                </Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter image location'
                                    value={image || ''}
                                    onChange={(e) => setImage(e.target.value)}
                                >
                                </Form.Control>
                                <Form.Control
                                    type='file'
                                    id='image-file'
                                    label='Choose File'
                                    custom='true'
                                    value=""
                                    onChange={uploadFileHandler}
                                >
                                </Form.Control>
                                {uploading && <Loader />}
                            </Form.Group>

                            <Form.Group controlId='brand'>
                                <Form.Label className='mt-2'>
                                    <em>Brand</em>:
                                </Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter Brand name'
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='category'>
                                <Form.Label className='mt-2'>
                                    <em>Category</em>:
                                </Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter Category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='price'>
                                <Form.Label className='mt-2'>
                                    <em>Price</em>:
                                </Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter Price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='countInStock'>
                                <Form.Label className='mt-2'>
                                    <em>In Stock</em>:
                                </Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter quantity in stock'
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='description'>
                                <Form.Label className='mt-2'>
                                    <em>Description</em>:
                                </Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows={5}
                                    className='rounded-0'
                                    placeholder='Enter Description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>


                            <Button
                                type='submit' variant='primary'
                                className='update-btn text-center'
                                onClick={submitHandler}
                            >
                                Update
                            </Button>

                        </Form>
                }
            </FormContainer>
        </div>);
}


export default ProductEditScreen;
