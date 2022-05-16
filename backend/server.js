import path from 'path'
/*8 this file is our entry point for our server, for our back end*/
import express from 'express' /*we are using common js syntax but later 
on we will us es syntax**/
import dotenv from 'dotenv' //11b 
import colors from 'colors' //15b 
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js' //21f
import connectDB from './config/db.js'  //14d

//19c
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js' //33
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'


dotenv.config() //11b 

connectDB()  //14d

/*8b we init express*/
const app = express()

if (process.env.NODE_ENV === 'development') { /*we only wanna use morgan in development mode
 so ##process.env.NOVE_ENV### and morgand has different arguments, we use dev this time*/
    app.use(morgan('dev'))
}

//33e it will allows us to accept json data in the body 
app.use(express.json())

//8e
app.get('/', (req, res) => {
    res.send('API is running...')
})

/*19c we link to everything that uses /api/prodcuts its gonna be link 
to productRoutes */
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes) //33
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

/*When we are reddy to make our payment, we will hit this route and fetch our client Id*/
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))) /*this is how we make a folder static*/

/*21g MIDDLEWARE fallback for 404 which is a no found error */
app.use(notFound)

/*21g we implement our error MIDDLEWARE, if we want to overrride the default 
error hanlding */
app.use(errorHandler)

const PORT = process.env.PORT || 5000 //11D

//8b - 11d
app.listen(PORT, console.log(`Sever runing in ${process.env.NODE_ENV} mode
 on port ${PORT}`.yellow.bold))