/*this will validate the token */
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'  //36
import User from '../models/userModel.js'

/* 36b the way the token is sent in, its trhoug the header */
const protect = asyncHandler(async (req, res, next) => {
    let token

    /*now we are checking for the token and if it starts witb "Bearer"*/
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1] /*Because i just want the token 
            and not the Bearer, we use .split by the space (' '), and we get the second
            part of the array [1] which is the token */

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            /*so now, we can get the user is with decoded.id*/

            req.user = await User.findById(decoded.id).select('-password')
            /*we avoid grabbing the password select('-password') 
            and we put all the user data in this req.user  */

            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authorized, no token')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }

})

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as an admin')
    }
}

export { protect, admin }