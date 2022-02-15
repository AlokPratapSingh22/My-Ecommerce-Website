import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Button, Form, Image } from "react-bootstrap";
import { addToCart, removeFromCart } from "../actions/cartActions";
import Message from '../components/Message';


export default function CartScreen() {
  let { id } = useParams()
  let location = useLocation()
  let navigate = useNavigate()

  // id from the parameter
  const productId = id
  // qty from the url
  const qty = location.search ? Number(location.search.split('=')[1]) : 1
  const dispatch = useDispatch()

  const cart = useSelector(state => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty]);


  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }
  const userInfo = localStorage.getItem('userInfo')

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login')
    } else {
      navigate('/shipping')
    }
  }

  return (<Row >
    <Col md={12} lg={8}>
      <h1 className='fs-2'>Shopping Cart</h1>
      <div className="bg-effect"></div>

      {cartItems.length === 0 ? (
        <Message className='w-50' variant='dark'>
          Your Cart is empty!
          <br></br>

          <Button as={Link} to='/' variant='dark' className='mt-2 btn-sm return-btn d-block'>
            <i className='fas fa-arrow-alt-from-right'></i> Go Back
          </Button>

        </Message>) : (

        <ListGroup className='cart-group'>

          {cartItems.map(item => (

            <ListGroup.Item key={item.product} className='mt-5 cart-item'>

              {/* Image */}

              <Row>
                <Col xs={3} sm={3} md={3} className='d-flex justify-content-center flex-column'>
                  <Image src={item.image} alt={item.name} fluid className='cart-item-img' />
                </Col>

                {/* Item name */}

                <Col xs={4} sm={4} md={4} className='d-flex justify-content-center text-center flex-column'>
                  <Link to={`/product/${item.product}`} className='text-decoration-none'>
                    <strong>{item.name}</strong>
                  </Link>
                </Col>

                {/* Price */}

                <Col xs={2} sm={2} md={2} className='d-flex justify-content-center flex-column'>
                  {item.qty === 1 ?
                    `$${item.price}` :
                    `$${item.price} x ${item.qty} = $${(item.price * item.qty).toFixed(2)}`
                  }
                </Col>

                {/* Quantity selector */}

                <Col xs={2} sm={2} md={2} className='d-flex justify-content-center flex-column'>
                  <Form.Control
                    as='select'
                    value={item.qty}
                    onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                    className='text-center count-selector'
                  >
                    {
                      [...Array(item.countInStock).keys()].map((x) =>
                      (<option key={Number(x + 1)} value={Number(x + 1)}>
                        {x + 1}
                      </option>)
                      )
                    }
                  </Form.Control>
                </Col>

                {/* Delete Button */}

                <Col xs={1} sm={1} md={1} className='d-flex justify-content-center flex-column'>
                  <Button
                    className='btn-link delete-btn'
                    onClick={() => removeFromCartHandler(item.product)}
                  >
                    <i className='fas fa-trash-alt trash'></i>
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          )
          )}
        </ListGroup>
      )
      }
    </Col>
    <Col md={12} lg={4}>
      <ListGroup variant='flush' className='cart-card'>
        <ListGroup.Item className='cart-card-item'>
          <h2 className='h2-header'>Subtotal </h2>
          <hr />
          <h5>{cartItems.reduce((acc, item) => acc + Number(item.qty), 0)} items</h5>
          <hr />
          Total = <h4 className='d-inline ls-1'>$ {cartItems.reduce((acc, item) => acc + Number(item.qty) * item.price, 0).toFixed(2)}</h4>
        </ListGroup.Item>
        <ListGroup.Item className='cart-card-item'>
          <Button
            type='button'
            className='checkout'
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            Checkout
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Col>
  </Row >);
}