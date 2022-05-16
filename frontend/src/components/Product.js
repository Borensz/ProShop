import React from 'react' //3c
import { Link } from 'react-router-dom' //5c
import { Card } from 'react-bootstrap' //3
import Rating from './Rating' //4a -> we create file /Rating.js


const Product = ({ product }) => { /*({ product }) so we have acces to 
propsproduct coming from map HomeScreen.js */
  return (
    <Card className='my-3 p-3 rounded'>
        
        <Link to={`/product/${product._id}`}>
            <Card.Img src={product.image} variant='top' />   
        </Link>

        <Card.Body>
        <Link to={`/product/${product._id}`}>
            <Card.Title as='div'><strong>{product.name}</strong></Card.Title>
        </Link>  
        </Card.Body>

        <Card.Text as='div'>
            <Rating 
                value={product.rating} 
                text={`${product.numReviews} reviews`} 
            />  {/*<Rating /> is taking 2 props, value and text*/}
        </Card.Text>

        <Card.Text as='h3'>${product.price}</Card.Text>

    </Card>
  )
}

export default Product
