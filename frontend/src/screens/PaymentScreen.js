import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

const PaymentScreen = ({ }) => {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart /*we are pulling shippingAddress from cart here*/

    const navigate = useNavigate()

    if (!shippingAddress) {
        navigate('/shipping')
    }

    /*here we are passing PayPal as the default payment method ## useState('PayPal')## */
    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    const dispatch = useDispatch()


    const submitHandler = (e) => {
        e.preventDefault() //because its a form we add this line
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    /*in each screen we put the steps we made and we are <CheckoutSteps step1 step2 />*/
    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            label='PayPal or Credit Card'
                            id='PayPal'
                            name='paymentMethod'
                            value='PayPal'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}>
                        </Form.Check>
                        {/*in case we wanna add another payment method we just need to add
                        another <Form.Check></Form.Check> 
                        <Form.Check
                            type='radio'
                            label='Stripe'
                            id='Stripe'
                            name='paymentMethod'
                            value='Stripe'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}>
                        </Form.Check>
                        */}
                    </Col>
                </Form.Group>

                <Button type='submit' variant='primary'>Continue</Button>

            </Form>
        </FormContainer>
    )
}

export default PaymentScreen
