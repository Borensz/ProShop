/*18 this is a separate script we can run to import data*/
import mongoose from "mongoose";
import dotenv from 'dotenv'
import colors from 'colors'
import users from "./data/users.js";
import products from "./data/products.js";
import User from './models/userModel.js';
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from "./config/db.js";

dotenv.config()

connectDB()

/*18a first thhing we wanna do is to clear all 3 collections completely
the Order Product and User Models */
/*b)deleteMany is a mongoose method, if its empty it will destroy every
    thing, and because it returns a promise, we need to use await before that*/
const importData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()
        /*b) then we import the users */
        const createdUsers = await User.insertMany(users)  /*createdUsers is gonna
        be an array all of the users */
        const adminUser = createdUsers[0]._id /*because in our data users.js its in 
        the first position the admin [0]*/
        const sampleProducts = products.map((product) => { /*we are adding by mapping
        the admin user to each product*/
            return { ...product, user: adminUser }/*{ ...product, user: adminUser} it returns
            an object with all of the staff there is in the product already: ...product, an
            in adition to that we add to the user field, the adminuser*/
        })

        await Product.insertMany(sampleProducts)

        console.log('Data imported!'.green.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Data Destroyed!'.red.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}