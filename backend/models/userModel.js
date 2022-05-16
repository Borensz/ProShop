//16a 
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },   
    email: {
        type: String, 
        required: true,
        unique: true,
    },   
    password: {
        type: String, 
        required: true,
    },   
    isAdmin: {
        type: Boolean, 
        required: true, 
        default: false,
    },   
}, {
    timestamps: true  /*it will create the filds automatically*/
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
/*.compare, we pass in the enteredPassword and we compare it to 
this.password */

/*pre('save') because we want this to happen pre save, like whe we calle .create for ex*/
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next()
    } /*this way, we make sure that this only runs when the password is modified*/

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema) 

export default User