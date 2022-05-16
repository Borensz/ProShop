import asyncHandler from 'express-async-handler' //32a
import Product from '../models/productModel.js' /*32a*/

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 4  /*how many products do i wanna show per page*/
    const page = Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword, /*$regex is a regular expression, and we are using thins instead
           of name directly because otherwise we should have to write the whole name like iphone intead of
           iph, to the product to show up*/
            $options: 'i', /*i its case insensitive*/
        }
    } : {}
    /*req.query its how you get query strings*/
    /*19e*we wrap everything with
   our asyncHandler */
    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword }).limit(pageSize).skip
        (pageSize * (page - 1)) /*19d when we pass in an empty 
object ({}) it gives us everything , this Product.find return a promise, 
actually , whenever we us a mongoose method, it always returns a promise*/
    /*this is not gonna handle any errors so we could do a try catch here, but we 
    will have to do that in every route we have in our data base, so instead
    we can use a package called express-async-handler*/
    res.json({ products, page, pages: Math.ceil(count / pageSize) }) /*res.json is gonna convert it into the json content type*/
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)/*(req.params.id) will
    give use the it that in the URL*/

    if (product) {
        res.json(product)
    } else {
        res.status(404) /*21H.json({ message: 'Product not found' })*/
        throw new Error('Product not found')
    }

    res.json(product)
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)/*(req.params.id) will
    give use the it that in the URL*/

    if (product) {
        await product.remove()
        res.json({ message: 'Product removed' })
    } else {
        res.status(404) /*21H.json({ message: 'Product not found' })*/
        throw new Error('Product not found')
    }

    res.json(product)
})

// @desc    Create a product
// @route   DELETE /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock
    } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        res.status(201).json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body /*the rating and the comment for that particular review*/

    const product = await Product.findById(req.params.id) /*here we find the product we are reviewing*/

    if (product) { /*here we wanna check if the user has already summited a review*/
        const alreadyReviewed = product.reviews.find(r => /*we access the array reviews ##products.reviews##*/
            r.user.toString() === req.user._id.toString()) /*for each review, check the review.user
            which is in the model*/

        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed')
        }

        const review = {
            name: req.user.name, /*the logged in user name*/
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review)

        product.numReviews = product.reviews.length /*this will update the number of reviews*/

        product.rating = product.reviews.reduce((acc, item) => /*this will give us the average reviews*/
            item.rating + acc, 0) / product.reviews.length

        await product.save()
        res.status(201).json({ message: 'Review added' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3) /*To sort them
    in ascendand order ##sort({ rating: -1})## and limit3 because i only wanna get 3*/

    res.json(products)
})

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
}