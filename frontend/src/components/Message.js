//26c 
import React from 'react'
import { Alert } from 'react-bootstrap'

const Message = ({ variant, children }) => { /*it takes in 2 props, the variant and
the children that is the text that we want inside*/
  return (
    <Alert variant={variant}>
        {children}
    </Alert>
  )
}

Message.defaultProps = {
    variant: 'info',    /*info is just a blue color*/
}

export default Message
