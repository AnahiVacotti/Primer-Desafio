import ProductManager from './ProductManager.js'
import fs from 'fs'

class CartManager {
    constructor(pathFile) {
        this.path = pathFile
        this.id = 0
        this.initialize()
    }

    async initialize() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data) || []
            this.id = this.calculateNextId()
        } catch (error) {
            console.error(`Error initializing CartManager: ${error}`)
            throw error
        }
    }

    calculateNextId() {
        const calcMaxId = this.carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0)
        return calcMaxId + 1
    }

    async createCart() {
        const newId = this.calculateNextId()
        const cartReady = {
            id: newId,
            products: []
        }
        this.carts.push(cartReady)
        const newList = JSON.stringify(this.carts, null, 2)
        try {
            await fs.promises.writeFile(this.path, newList, 'utf-8')
            return 'New cart created'
        } catch (error) {
            return 'Error writing to file'
        }
    }

    async getCarts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts()
        const foundCart = carts.find(cart => cart.id === id)
        return foundCart || 'Not found'
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const carts = await this.getCarts(cartId)
        const foundCart = carts.find(cart => cart.id === cartId)

        if (!foundCart) return 'Cart not found'

        const productManager = new ProductManager('./src/data/products.json')
        const foundProduct = await productManager.getProductBytId(productId)

        if (foundProduct === 'Not found') return 'Product not found'

        const existingProduct = foundCart.products.find(prod => prod.product === foundProduct.id)
        if (existingProduct) {
            existingProduct.quantity += quantity
        } else {
            foundCart.products.push({
                product: foundProduct.id,
                quantity: quantity
            })
        }

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
        return 'Cart updated'
    }
}

export default CartManager