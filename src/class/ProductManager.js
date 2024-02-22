import fs from 'fs'

class ProductManager {
    constructor(pathFile) {
        this.path = pathFile
        this.id = 0
        this.initialize()
    }

    async initialize() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data) || []
            this.id = this.calculateNextId()
        } catch (error) {
            console.error(`Error initializing ProductManager: ${error.message}`)
            throw error
        }
    }

    calculateNextId() {
        const calcMaxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0)
        return calcMaxId + 1
    }

    async addProduct(product) {
        if (product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock &&
            product.status &&
            product.category
        ) {
            let found = this.products.find(prod => prod.code === product.code)
            if (!found) {
                const newId = this.calculateNextId()
                product.id = newId
                this.products.push(product)
                this.id = newId
                const newList = JSON.stringify(this.products, null, 2)
                try {
                    await fs.promises.writeFile(this.path, newList, 'utf-8')
                    return 'Product added successfuly'
                } catch (error) {
                    return 'Error writing to file'
                }
            } else {
                let found = this.products.find(prod => prod.code === product.code)
                return `The code "${found.code}" is already in use `
            }
        }
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }

    async getProductBytId(id) {
        const products = await this.getProducts()
        const foundProduct = products.find(product => product.id === id)
        return foundProduct || 'Not found'
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts()
        const index = products.findIndex(product => product.id === id)
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedFields, id }
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8')
                return 'successul modificacion'
            } catch (error) {
                return 'Error writing to file'
            }
        } else if (index === -1) {
            return 'Product does not exist'
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts()
        if (products.find(product => product.id === id)) {
            const filteredProducts = products.filter(product => product.id !== id)
            await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2), 'utf-8')
            return 'Product deleted'
        } else {
            return 'Product not found'
        }
    }
}

export default ProductManager


