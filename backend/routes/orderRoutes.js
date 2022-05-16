import express from 'express'
const router = express.Router()
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

/*if we make a post request to /api/orders we should be abble to call this function
##addOrderItems)##*/
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)

/*to*implement middleware, we just put it as a first argument like this 
**).get(protect, getUserProfile)***/

export default router 