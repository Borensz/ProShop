import React, { useState, useEffect } from 'react'
import axios from 'axios'
//import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { PayPalButton } from 'react-paypal-button-v2'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

const OrderScreen = () => {
	const params = useParams() /*we are gettin the product id from URL*/
	const orderId = params.id

	const [sdkReady, setSdkReady] = useState(false)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const orderDetails = useSelector((state) => state.orderDetails)
	const { order, loading, error } = orderDetails
	/*and if this success, then it means that everything went through and we are ready 
	to be redirect it,, so we bring in useEffect */

	/*we wanna check from the orderPayreduccer if the success is true now*/
	const orderPay = useSelector((state) => state.orderPay)
	const { loading: loadingPay, success: successPay } = orderPay
	/*we have to reName loading because we already had a loading above so 
	##loading: loadingPay## same with success */

	const orderDeliver = useSelector((state) => state.orderDeliver)
	const { loading: loadingDeliver, success: successDeliver } = orderDeliver

	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

	if (!loading) {
		//  calculate prices
		const addDecimals = (num) => {
			return (Math.round(num * 100) / 100).toFixed(2)
		}

		order.itemsPrice = addDecimals(order.orderItems.reduce(
			(acc, item) => acc + item.price * item.qty,
			0
		))
	}

	/*useEffect(() => {
		dispatch(getOrderDetails(orderId))
	}, []) */


	useEffect(() => {
		if (!userInfo) {
			navigate('/login')
		}

		const addPayPalScript = async () => {
			const { data: clientId } = await axios.get('/api/config/paypal')
			const script = document.createElement('script') //this is Vanilla JavaScript
			script.type = 'text/javascript'
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
			script.async = true
			script.onload = () => { /*this tells us that the script is being loaded*/
				setSdkReady(true)
			}
			document.body.appendChild(script) /*we are dynamical adding the paypal script*/
		}/*we are adding the script into the body ##appendChild(script)## */



		/*we want to be able to see the order even thou we dont have the successpay yet 
		##(!order || order._id !== orderId || successPay## */
		if (!order || order._id !== orderId || successPay || successDeliver) {
			dispatch({ type: ORDER_PAY_RESET }) /*To avoid once you paid to keep refreshing*/
			dispatch({ type: ORDER_DELIVER_RESET })
			dispatch(getOrderDetails(orderId))
		} else if (!order.isPaid) {
			if (!window.paypal) { /*with ##!window.paypal## we check if the paypal script isnot there*/
				addPayPalScript()
			} else { /*if the paypal script is there then we want to set the Sdk ready to true
			so it will add the paypal script##script.src##*/
				setSdkReady(true)
			}
		}
	}, [dispatch, navigate, userInfo, order, orderId, successPay, successDeliver])

	/*this is where we want to call that payorder action that we created*/
	/*##(paymentResult)## is given from paypal*/
	const successPaymentHandler = (paymentResult) => {
		console.log(paymentResult)
		dispatch(payOrder(orderId, paymentResult))
	}

	const deliverHandler = () => {
		dispatch(deliverOrder(order))
	}

	return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
		<>
			<h1>Order {order._id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>

						<ListGroup.Item>
							<h2>Shipping</h2>
							<p><strong>Name: </strong> {order.user.name}</p> {/*we should be able to do
							##r.user.name}## because we used the .populate method*/}
							<p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
							<p>
								<strong>Address:</strong>
								{order.shippingAddress.address},
								{order.shippingAddress.city}{' '}
								{order.shippingAddress.postlCode},{' '}
								{order.shippingAddress.country}
							</p>
							{order.isDelivered ? (
								<Message variant='success'>Delivered on {order.deliveredAt}</Message>
							) : (
								<Message variant='danger'>Not Delivered</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Message variant='success'>Paid on {order.paidAt}</Message>
							) : (
								<Message variant='danger'>Not Paid</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items</h2>
							{order.orderItems.lenght === 0 ?
								<Message>Order is empty</Message> : (
									<ListGroup variant='flush'>
										{order.orderItems.map((item, index) => (
											<ListGroup.Item key={index}>
												<Row>
													<Col md={2}>
														<Image
															src={item.image}
															alt={item.name}
															fluid
															rounded
														/>
													</Col>
													<Col>
														<Link to={`/product/${item.product}`}>
															{item.name}
														</Link>
													</Col>
													<Col md={4}>
														{item.qty} x ${item.price} = ${item.qty * item.price}
													</Col>
												</Row>
											</ListGroup.Item>
										))}
									</ListGroup>
								)
							}
						</ListGroup.Item>

					</ListGroup>
				</Col>

				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>

							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${order.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>${order.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${order.taxPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>

							{!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader />}
									{!sdkReady ? (<Loader />) : (
										<PayPalButton
											amount={order.totalPrice}
											onSuccess={successPaymentHandler}
										/>
									)}
								</ListGroup.Item>
							)}
							{loadingDeliver && <Loader />}
							{/*if userInfo &&  userInfo.isAdmin && order.isPaid && !order.isDelivered is true then...
							ps: userInfo basically means if the user is logged in*/}
							{userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
								<ListGroup.Item>
									<Button type='button' className='btn btn-block' onClick={deliverHandler} >
										Mark As Delivered
									</Button>
								</ListGroup.Item>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
}

export default OrderScreen
