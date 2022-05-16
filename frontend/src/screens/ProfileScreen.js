import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Table, Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { listMyOrders } from '../actions/orderActions'

const ProfileScreen = () => {

	const navigate = useNavigate()
	const location = useLocation()

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [message, setMessage] = useState(null)


	const dispatch = useDispatch() //

	const userDetails = useSelector((state) => state.userDetails) //
	const { loading, error, user } = userDetails //

	const userLogin = useSelector((state) => state.userLogin) //
	const { userInfo } = userLogin //

	const userUpdateProfile = useSelector((state) => state.userUpdateProfile) //
	const { success } = userUpdateProfile //

	const orderListMy = useSelector((state) => state.orderListMy)
	const { loading: loadingOrders, error: errorOrders, orders } = orderListMy
	/*we have to rename it so its already called on userDetails ## { loading: loadingOrders##*/

	/*in this case we are getting a profile dispatch(getUserDetails('profile')) 
	in the actions, because profile gets pass in, its gonna hit user/profile here
	const { data } = await axios.get(`/api/users/${id}`, config) */
	useEffect(() => {
		if (!userInfo) {
			navigate('/login')
		} else {
			if (!user.name) {
				dispatch(getUserDetails('profile'))
				dispatch(listMyOrders())
			} else {
				setName(user.name)
				setEmail(user.email)
			}
		}
	}, [dispatch, navigate, userInfo, user])

	/*once we call submit handler by submiting the form, its gonna dispatch updateUserProfile
	and its gonna pass in the user **updateUserProfile({ id: user._id, name, email, password }))** 
	this will call the action in  frontend\src\actions\userActions.js passing the user
	****export const updateUserProfile = (user)****  */
	const submitHandler = (e) => {
		e.preventDefault()
		if (password !== confirmPassword) {
			setMessage('Passwords do not match')
		} else {
			dispatch(updateUserProfile({ id: user._id, name, email, password }))
		}
	}

	return (
		<Row>
			<Col md={3}>
				<h2>User Profile</h2>
				{/*if message then I want to show a <Message> etc*/}
				{message && <Message variant='danger'>{message}</Message>}
				{error && <Message variant='danger'>{error}</Message>}
				{success && <Message variant='success'>Profile Updated</Message>}
				{loading && <Loader />}
				<Form onSubmit={submitHandler}>

					<Form.Group controlId='name'>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type='name'
							placeholder='enter name'
							value={name}
							onChange={(e) => setName(e.target.value)}
						>
						</Form.Control>
					</Form.Group>

					<Form.Group controlId='email'>
						<Form.Label>Email Address</Form.Label>
						<Form.Control
							type='email'
							placeholder='enter email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						>
						</Form.Control>
					</Form.Group>

					<Form.Group controlId='password'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='enter password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						>
						</Form.Control>
					</Form.Group>

					<Form.Group controlId='confirmPassword'>
						<Form.Label>confirm Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Confirm password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						>
						</Form.Control>
					</Form.Group>

					<Button type='submit' variant='primary'>
						Update
					</Button>
				</Form>
			</Col>
			<Col md={9}>
				<h2>My orders</h2>
				{loadingOrders ? <Loader /> : errorOrders ?
					<Message variant='danger'>{errorOrders}</Message> : (
						<Table bordered hover responsive className='table-sm'>
							<thead>
								<tr>
									<th>ID</th>
									<th>DATE</th>
									<th>TOTAL</th>
									<th>PAID</th>
									<th>DELIVERED</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{orders.map((order) => (
									<tr key={order._id}>
										<td>{order._id}</td>
										<td>{order.createdAt.substring(0, 10)}</td>
										<td>{order.totalPrice}</td>
										<td>{order.isPaid ? (order.paidAt.substring(0, 10)) : (
											<i className='fas fa-times' style={{ color: 'red' }}></i>)}
										</td>
										<td>{order.isDelivered ? (order.deliveredAt.substring(0, 10)) : (
											<i className='fas fa-times' style={{ color: 'red' }}></i>)}
										</td>
										<td>

											<Button as={Link} to={`/order/${order._id}`} className='btn-sm' variant='light'>Details</Button>

										</td>

									</tr>
								))}
							</tbody>
						</Table>
					)}
			</Col>
		</Row>
	)

}

export default ProfileScreen