//14c this is gonna be our connection file
import mongoose from 'mongoose'

const connectDB = async () => {
    try {/*mongoose.connect take 2 params, first one is our uri that its taken from
    our.env file and the other ones are to avoid errors*/
        const conn = await mongoose.connect(process.env.MONGO_URI,  {
            useUnifiedTopology: true, 
            useNewUrlParser: true, 
        })  
            /*15c cyan.underline) red.underline.bold) from our colors package*/
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold)   
        process.exit(1)
    }   
}

export default connectDB