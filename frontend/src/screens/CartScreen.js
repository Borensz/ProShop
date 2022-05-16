import React, { useEffect } from 'react'  //30a
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions' //32

const CartScreen = ({ }) => {
  const params = useParams() /*we are gettin the product id from URL*/
  const productId = params.id

  const location = useLocation() /* useLocation() it returns the current URL in the 
  web browser */
  const qty = location.search ? Number(location.search.split('=')[1]) : 1
  
  /* location.search get the URL search string, beginning with a ?.
  so, if there is a location.search like ?qty=3 then we only want the
  number , so we .split by the = sign, si ti will create an arra
  with {?qty,3} but we only want the number , which is in the position
  1 [1], otherwise, the quantity is one, and we warpt it in .number so we
  transform it inot a number*/
  const dispatch = useDispatch()
  /*so we can call the action */

  const cart = useSelector(state => state.cart)
  const { cartItems } = cart 

  

  useEffect(() => {
    if(productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  /*31 a*/
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const navigate = useNavigate() //31a
  
  const checkoutHandler = () => { //31a
    navigate(`/login?redirect=/shipping`)
  }

  return ( 
  <Row>
    <Col md={8}>
      <h1>Shopping Cart</h1> 
      {cartItems.length === 0 ? 
        <Message>Your cart is empty <Link to='/'>Go Back</Link></Message> : 
        (
          <ListGroup variant='flush'>
            {cartItems.map(item => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  
                  {/*the <Form.control> is explained in 28a ProductScreen
                  we have to dispatch it because its an action 
                  */}
                  <Col md={2}> {/*the <Form.control> is explained in 28a ProductScreen*/}
                    <Form.Control 
                      as='select' 
                      value={item.qty} 
                      onChange={(e) => 
                        dispatch(addToCart(item.product, Number(e.target.value)))}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>  
                  </Col>

                  <Col md={2}>
                    <Button 
                      type='button' 
                      variant='light' 
                      onClick={() => removeFromCartHandler(item.product)} 
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>

                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )
      }
    </Col>
    
    {/*31 to show the total numbers of items we have to use.reduce() high order arrar
    method ***({cartItems.reduce((acc, item) =>*** which it takes an arrow function with 
    the accumulator 'acc' and the current value 'item' , 0 its where we want to accumula
    tor to start, in this case 0

    toFixed(2) we make the number with 2 decimals
    */}
    <Col md={4}>
      <Card>       
        <ListGroup variant='flush'>
          
          <ListGroup.Item>
            <h2>
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) 
              items
            </h2>
            ${cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)
            }
          </ListGroup.Item>

          <ListGroup.Item>
            <Button 
              type='button' 
              className='btn-block' 
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </Button>
          </ListGroup.Item>
        
        </ListGroup>
      </Card>
    </Col>
  
  </Row>
  
  )
}

export default CartScreen
