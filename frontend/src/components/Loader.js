//26b 
import React from 'react' 
import { Spinner } from 'react-bootstrap'

/*26b we can look at the documentation for react-bootstrap to wee what is available
, <Spinner >*/
const Loader = () => {
  return (
    <Spinner 
        animation='border' 
        role='status' 
        style={{
            width:'100px', 
            height: '100px', 
            margin: 'auto', 
            display:'block'
        }}
    >
        <span className='sr-only'>Loading...</span>
    </Spinner>
  )
}

export default Loader
