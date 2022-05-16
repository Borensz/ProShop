import React from 'react';
import { useDispatch, useSelector } from 'react-redux' //46
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import SearchBox from './SearchBox';
import { logout } from '../actions/userActions';

const Header = () => {
	const dispatch = useDispatch()

	const userLogin = useSelector(state => state.userLogin)
	const { userInfo } = userLogin

	const logoutHandler = () => {
		dispatch(logout())
	}


	return (
		<header>
			<Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
				<Container>

					<Navbar.Brand as={Link} to='/'>Nsz-Shop</Navbar.Brand> {/*5c we get rid of the href tag ane we 
                    wrap in LinkContainer*/}
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<SearchBox />
						<Nav className="ml-auto">{/*ml = margin left*/}
							<Nav.Link as={Link} to='/cart'><i className='fas fa-shopping-cart'></i> Cart</Nav.Link>
							{userInfo ? (
								<NavDropdown title={userInfo.name} id='username'>
									{/* <Nav.Link as={Link} to='/profile'>*/}
									<NavDropdown.Item as={Link} to='/profile'>Profile</NavDropdown.Item>
									{ /*</Nav.Link>*/}
									<NavDropdown.Item onClick={logoutHandler}>
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							) : (
								<Nav.Link as={Link} to='/login'><i className='fas fa-user'></i>
									Sign In
								</Nav.Link>)}
							{/*if userinfo and userinfo.is adming then :*/}
							{userInfo && userInfo.isAdmin && (
								<NavDropdown title='Admin' id='adminmenu'>
									<NavDropdown.Item as={Link} to='/admin/userlist'>Users</NavDropdown.Item>
									<NavDropdown.Item as={Link} to='/admin/productlist'>Products</NavDropdown.Item>
									<NavDropdown.Item as={Link} to='/admin/orderlist'>Orders</NavDropdown.Item>

								</NavDropdown>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	)
}

export default Header
