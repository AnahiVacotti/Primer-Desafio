import { Router } from "express"
import { productModel } from "../dao/models/product.model.js"

const productsRouter = Router()


//Render on front with handlebars with IO
productsRouter.get('/', async (req, res) => {
    try {
        const allProducts = await productModel.find({}, { _id: 0, __v: 0 }).lean() //We ensure flat javascript objects and not complex mongoose prototypes
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

//All or with limit
productsRouter.get('/api/products', async (req, res) => {
    const { limit } = req.query
    try {
        const products = await productModel.find().limit(limit)
        res.status(200).send({ result: 'Success', message: products })
    } catch (error) {
        req.status(400).send({
            response: 'Error read db', message: error
        })
    }
})

//See With ID
productsRouter.get('/api/products/:id', async (req, res) => {
    const { id } = req.params
    try {
        const product = await productModel.findById(id)
        if (!product) {
            return res.status(404).send('Product not found')
        }
        res.status(200).send({ result: 'Success', message: product })
    } catch (error) {
        res.status(404).send({ result: 'Error', message: 'Not found' })
    }
})

//prueba de ruta
productsRouter.get('/products', async (req, res) => {
    const allProducts = await productModel.find({}, { _id: 0, __v: 0 }).lean();
    let page = parseInt(req.query.page);
    if (!page) page = 1;

    // Usar lean
    let result = await productModel.paginate({}, { page, limit: 5, lean: true });
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/api/products?page=${result.prevPage}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/api/products?page=${result.nextPage}` : '';
    result.isValid = !(page <= 0 || page > result.totalPages);

    // Pasar allProducts y result como parámetros
    const datosVista = {
        allProducts: allProducts,
        result: result
    };

    // Renderizar la vista con los datos
    res.render('products', datosVista);
});
//productsRouter.get('/cart', async (req, res) =>{
   // let carrito = parseInt(req.query.page);
   // if (carrito) carrito = 5
    //res.render('cart', result)
//})

//Add new product
productsRouter.post('/api/products', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category } = req.body

    try {
        let prod = await productModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category
        })
        res.status(200).send({ result: "Success", message: prod })
    } catch (error) {
        res.status(400).send({
            result: 'Error create product', message: error.message
        })
    }
})

//Update product
productsRouter.put('/api/products/:id', async (req, res) => {
    const { id } = req.params
    const { title, description, price, thumbnail, code, stock, status, category } = req.body

    try {
        const product = await productModel.findByIdAndUpdate(id, {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category
        })

        if (!product) {
            return res.status(404).send({ result: 'Error', message: 'Product not found' })
        }
        res.status(200).send({ result: 'OK', message: 'Product updated' })
    } catch (error) {
        res.status(400).send({ result: 'Error updating product', message: error })
    }
})

//Delete Product
productsRouter.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params
    try {
        const product = await productModel.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).send({ result: 'Error', message: 'Product not found' })
        }
        res.status(200).send({ result: 'Success', message: 'Product deleted', product })
    } catch (error) {
        res.status(400).send({ result: 'Error deleting product', message: error })
    }
})

export default productsRouter