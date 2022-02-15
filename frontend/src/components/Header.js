import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import SearchBox from "../components/SearchBox";

function Header() {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const logoutHandler = () => {
        dispatch(logout())
        navigate('/')
    }

    return (
        <header>

            <Navbar bg="light" expand="lg" variant='light' fixed='top' collapseOnSelect>

                <Container>
                    <Navbar.Brand href="/" className='h1 title'>
                        Shop
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className='mx-auto'>
                            <SearchBox />
                        </Nav>
                        <Nav className="mx-auto">
                            <Nav.Link as={NavLink} activeclassname='is-active' to="/" className='btn-link'>
                                <i className="fas fa-home"></i>{' '}Home
                            </Nav.Link>
                            <Nav.Link as={NavLink} activeclassname='is-active' to="/cart" className='me-5'>
                                <i className="fas fa-shopping-cart"></i>{' '}Cart
                            </Nav.Link>
                        </Nav>
                        <hr className='bg-white' />

                        <Nav className="me-0">
                            {userInfo && userInfo.is_admin ? (
                                <NavDropdown title={`👤Admin`} active id='username' className="mx-auto">
                                    <NavDropdown.Item as={NavLink} to='/profile'>
                                        Profile
                                    </NavDropdown.Item>

                                    <NavDropdown.Item as={NavLink} to='/admin/user-list/'>
                                        Users
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to='/admin/product-list'>
                                        Products
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to='/admin/order-list'>
                                        Orders
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : userInfo ? (
                                <NavDropdown title={`👤${userInfo.name}`} active id='username'>

                                    <NavDropdown.Item as={NavLink} to='/profile'>
                                        Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) :

                                <Nav.Link as={NavLink} activeclassname='is-active' to="/login/" className='btn-link'>
                                    <i className="fas fa-sign-in-alt"></i>{' '}
                                    Login
                                </Nav.Link>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>

            </Navbar>
        </header >
    )
}

export default Header;
