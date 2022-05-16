//35 
import jwt from 'jsonwebtoken' 

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}
/*We are storing our second argument in the secret, in our.env, 
30d equal 30days*/  

export default generateToken