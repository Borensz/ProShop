import React from 'react'
import PropTypes from 'prop-types'


const Rating = ({ value, text, color }) => { /*from Products.js <Rating > 4b */
  return (
    <div className='rating'>
        <span>
            <i 
                style={{color}}
                className={
                value >= 1 
                ? 'fas fa-star' 
                : value >= 0.5 
                ? 'fas fa-star-half-alt' 
                : 'far fa-star'}
            >
            </i>       
        </span>  {/*we have the span to represent each one of the stars
        with an icon*/}  
        <span>
            <i 
                style={{color}} 
                className={
                value >= 2  
                ? 'fas fa-star' 
                : value >= 1.5 
                ? 'fas fa-star-half-alt' 
                : 'far fa-star'}
            >
            </i>       
        </span> 
        <span>
            <i 
                style={{color}} 
                className={
                value >= 3 
                ? 'fas fa-star' 
                : value >= 2.5 
                ? 'fas fa-star-half-alt' 
                : 'far fa-star'}
            >
            </i>       
        </span>  
        <span>
            <i 
                style={{color}} 
                className={
                value >= 4 
                ? 'fas fa-star' 
                : value >= 3.5 
                ? 'fas fa-star-half-alt' 
                : 'far fa-star'}
            >
            </i>       
        </span>  
        <span>
            <i 
                style={{color}} 
                className={
                value >= 5 
                ? 'fas fa-star' 
                : value >= 4.5 
                ? 'fas fa-star-half-alt' 
                : 'far fa-star'}
            >
            </i>       
        </span>
        <span>{text && text}</span> {/*this means {text && text} if 
        there is text, show it,, instead of writing text ? text : '' another way
         */ }  
    </div>
  )
}

Rating.defaultProps = { //we could just pass it to as a prop in Product.js <Rating> , another way
    color: '#d6ad33'
}

Rating.propTypes = { //we wont be using it , but it was just as an example
    value: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    color: PropTypes.string,
}

export default Rating
