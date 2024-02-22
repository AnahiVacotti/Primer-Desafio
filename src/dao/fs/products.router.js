import { Router } from "express"
import ProductManager from "../class/ProductManager.js"
const productsRouter = Router()

const productManager = new ProductManager('./src/data/products.json')

//Render on front whith handlebars
productsRouter.get('/', async (req, res) => {
    try {
        const allProducts = await productManager.getProducts()
        res.render('home', {
            style: '/css/styles.css',
            title: "All Products",
            allProducts
        })
    } catch (error) {
        res.status(400).send('Internal server Error', error)
    }
})

//Render products in real time with ws
productsRouter.get('/realtimeproducts', async (req, res) => {

    res.render('realTimeProducts', {
        style: '/css/styles.css'
    })
})

productsRouter.get('/api/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || undefined
        const allProducts = await productManager.getProducts()

        if (limit) {
            const limitedProducts = allProducts.slice(0, limit)
            res.json(limitedProducts)
        } else {
            res.json(allProducts)
        }
    } catch (error) {
        res.send('Internal Server Error')
    }
})

productsRouter.get('/api/products/:id', async (req, res) => {
    try {
        let isId = parseInt(req.params.id, 10)
        const foundProduct = await productManager.getProductBytId(isId)

        if (foundProduct !== 'Not found') {
            res.json(foundProduct)
        } else {
            res.send(`Product with ID ${req.params.id} not found`)
        }
    } catch (error) {
        res.send(`Ups...Something went wrong`)
    }
})

productsRouter.post('/api/products', async (req, res) => {
    try {
        const productState = await productManager.addProduct(req.body)
        res.status(200).send(productState)
    } catch (error) {
        res.status(400).send('Error adding product', error)
    }
})

productsRouter.put('/api/products/:pid', async (req, res) => {
    try {
        let pid = parseInt(req.params.pid)
        const statemodification = await productManager.updateProduct(pid, req.body)
        res.status(200).send(statemodification)
    } catch (error) {
        res.status(400).send('Error')
    }
})


productsRouter.delete('/api/products/:pid', async (req, res) => {
    try {
        let pid = parseInt(req.params.pid)
        const stateDelete = await productManager.deleteProduct(pid)
        res.status(200).send(stateDelete)
    } catch (error) {
        console.log(error)
    }
})

export default productsRouter