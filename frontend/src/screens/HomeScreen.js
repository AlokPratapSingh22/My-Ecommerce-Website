import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import { listProducts } from "../actions/productActions";
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from "../components/ProductCarousel";
import { useLocation } from 'react-router-dom';

export default function HomeScreen() {
    const dispatch = useDispatch()
    // getting productList from our state
    const productList = useSelector(state => state.productList)
    // product list has products, loading and error so we'll destructure it here
    const { products, pages, page, loading, error } = productList

    const location = useLocation()

    let keyword = location.search

    // loads every time there is a trigger
    useEffect(() => {
        // calling/ triggering our action
        // eslint-disable-next-line
        keyword = keyword.substring(8)
        if (keyword !== '') {
            keyword = "?search" + keyword
        }
        dispatch(listProducts(keyword))

    }, [dispatch, keyword]);

    return <div>
        {!keyword && <div>
            <ProductCarousel />
        </div>}
        <h2 className='font-poppins-bold mt-3 ms-3'>{!keyword || keyword.charAt(keyword.indexOf("keyword=") + 8) === '&' ? 'Latest Products' : 'Search Results'}</h2>
        <div className="bg-effect"></div>

        {loading ? <Loader />
            : error ? <Message variant='danger'>{error}</Message>
                :
                <div>
                    <Row>
                        {products.map(product => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='product'>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    <Paginate page={page} pages={pages} keyword={keyword} />
                </div>
        }

    </div>;
}
