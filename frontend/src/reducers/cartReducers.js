//29b
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD
} from '../constants/cartConstants' //31A

export const cartReducer = (
    state = { cartItems: [], shippingAddress: {} }, action) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            const item = action.payload /*in this payload, we are gonna have the id
            called product*/

            const existItem = state.cartItems.find((x) => x.product === item.product) /*for each
            of the items that are in the current state cartItems: (state = { cartItems: [] }, 
            find x.product which is the id if that is equal to the current item.product, that
            means that it exists*/

            if (existItem) {
                return {/*we map through the current cartItems :***state.cartItems.map*** */
                    ...state,
                    cartItems: state.cartItems.map((x) =>
                        x.product === existItem.product ? item : x),
                }
            } else {
                return { /*if it does not exist, we push it into the array caritItems: [...state.cartItems, item] 
                this way we add that new item , item] */
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }
        case CART_REMOVE_ITEM: //32
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            }
        case CART_SAVE_SHIPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload
            }
        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            }
        default:
            return state
    }
}