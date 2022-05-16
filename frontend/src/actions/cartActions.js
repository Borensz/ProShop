//29d 
import axios from "axios";
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD
} from "../constants/cartConstants";

/*29d this (id, qty) we can get from the URL, and then we use thunk (a function 
    inside of a function .
     getState): it allows us to get our entire state tree, to get 
     everything we want from our reducers, in this case we want to 
     grab the cartItem*/
export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`)

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}
/*we call this 'setItems' and we us the getState, and we want the cartItems in our state 
we need to use JSON.stringify because we can only save strings in local storage
and when we take it out we will have to use JSON.parse, to parse it back to javaScript*/

/*32  (dispatch, getState) so we can dispatch to our reducer and getState to get all the 
items there are in our cart, so we can reset our localstorage to minus whats its removed*/
export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    })
    /*getState()gets our entire state, but we want from cart, our cartItems*/
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPING_ADDRESS,
        payload: data,
    })

    localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    })

    localStorage.setItem('paymentMethod', JSON.stringify(data))
}