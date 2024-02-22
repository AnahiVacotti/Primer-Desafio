import { Router } from "express"
import CartManager from "../class/CartManager.js"
const cartRouter = Router()

const cartManager = new CartManager('./src/data/carts.json')

cartRouter.post('/api/carts', async (req, res) => {
    try {
        const createCart = await cartManager.createCart()
        res.status(200).send(createCart)
    } catch (error) {
        res.status(400).send(`Internal server error ${error}`)
    }
})

cartRouter.get('/api/carts/:cid', async (req, res) => {
    try {
        let isId = parseInt(req.params.cid)
        const foundCart = await cartManager.getCartById(isId)
        res.status(200).send(foundCart.products || 'Not found')
    } catch (error) {
        res.status(400).send(`Internal server error${error}`)
    }
})

cartRouter.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        let cartId = parseInt(req.params.cid)
        let prodId = parseInt(req.params.pid)
        const newProduct = await cartManager.addProductToCart(cartId, prodId)
        res.status(200).json(newProduct)
    } catch (error) {
        res.status(400).send(`Internal server error ${error}`)
    }
})

export default cartRouter