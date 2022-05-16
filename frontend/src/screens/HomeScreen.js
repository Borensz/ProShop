import React, { useEffect } from 'react' /*we bring the useEffect hook to make a request to our back end */
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'  /*25b useDispatch it will be use to dispatch
our call in action and useSelector which is used to select parts of the state, we need the productList
part of the state*/
import { Row, Col } from 'react-bootstrap' //3a
import Product from '../components/Product' //3b
import Message from '../components/Message' //26c 
import Loader from '../components/Loader' //26c
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions' /*25b we bring in the listProducts Action*/




const HomeScreen = () => { //3a
  const params = useParams()

  const keyword = params.keyword

  const pageNumber = params.pageNumber || 1 /*its always gonna be 1 if there is no specific page number*/

  const dispatch = useDispatch() /*25b first, in order to dispatch we need to define a variable
  called dispatch, in the past we will had to use connect but this is much faster */

  const productList = useSelector(state => state.productList) /*25c in order to display the products
  we nned to select them from out state
  i call this const productList whatever i call it in my store, in this case productList
  what selector takes in is a arrow function and which part of the state do we want, in this
  case the procucList part of it    */
  const { loading, error, products, page, pages } = productList /*25c we distracture here and we 
pull out what we want from products list: { loading, error, products } */

  useEffect(() => { /*it will make the request in the backend to get products*/
    dispatch(listProducts(keyword, pageNumber)) //25b
  }, [dispatch, keyword, pageNumber]) /*we are passing it as a dependency [dispatch] otherwise we will get a warning */
  /*useEffect is gonna fire off as soon the component load*/

  /*so basically , we have to parts 
  1) fireing off the action to get the products through the reducer down into the state : 
   useEffect(() => { 
   dispatch(listProducts()) 
  }, [dispatch]) 
  2) useSelector to actually grabb it from the state and then pull off whatever wa want from it: 
  const productList = useSelector(state => state.productList) 
  const { loading, error, products } = productList 
  */



  return (
    <>
      <Meta />
      {!keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-light'>Go Back</Link>}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map(product => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} /> {/*the props product is coming 
                    from the arrow function withing .map*/}
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )
      }
    </>
  )
}

export default HomeScreen //3a
