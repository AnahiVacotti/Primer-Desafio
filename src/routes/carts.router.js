import { Router } from 'express'
import { cartModel } from '../dao/models/cart.model.js'
import { productModel } from '../dao/models/product.model.js'
import mongoose from 'mongoose';  


import path from 'path';

const cartsRouter = Router()

cartsRouter.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).send({ result: 'Error', message: 'Invalid Cart ID' });
      }

      const cart = await cartModel.findById(cid);
      if (!cart) {
        return res.status(404).send({ result: 'Error', message: 'Cart not found' });
      }
      res.status(200).send({ result: 'Success', message: cart });
    } catch (error) {
      console.log(error);
      res.status(500).send({ result: 'Error', message: 'Internal Server Error' });
    }
});


cartsRouter.put('/api/carts', async (req, res) => {
    try {
        const cart = await cartModel.create({ products: [] })
        res.status(200).send({ result: 'Success', message: cart })
    } catch (error) {
        res.status(400).send({ result: 'Error', message: error })
    }
})

cartsRouter.route('/api/carts/:cid')
  .get(async (req, res) => {
    const { cid } = req.params;

    try {
      const cart = await cartModel.findById(cid);
      if (!cart) {
        return res.status(404).send({ result: 'Error', message: 'Cart not found' });
      }
      res.status(200).send({ result: 'Success', message: cart });
    } catch (error) {
      res.status(400).send({ result: 'Error consulting cart', error });
    }
  })
  .put(async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
      const cart = await cartModel.findByIdAndUpdate(cid, { products }, { new: true });
      if (!cart) {
        return res.status(404).json({ result: 'Error', message: 'Cart not found' });
      }
      res.status(200).json({ result: 'Success', message: 'Cart updated', cart });
    } catch (error) {
      res.status(400).json({ result: 'Error', message: error.message });
    }
  })
  .delete(async (req, res) => {
    const { cid } = req.params;

    try {
      const cart = await cartModel.findByIdAndDelete(cid);
      if (!cart) {
        return res.status(404).json({ result: 'Error', message: 'Cart not found' });
      }
      res.status(200).json({ result: 'Success', message: 'Cart deleted' });
    } catch (error) {
      res.status(400).json({ result: 'Error', message: error.message });
    }
});

cartsRouter.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            return res.status(404).json({ result: 'Error', message: 'Cart not found' })
        }

        const product = await productModel.findById(pid)
        if (!product) {
            return res.status(404).json({ result: 'Error', message: 'Product not found' })
        }

        const existingProductIndex = cart.products.findIndex(prod => prod.product.toString() === pid)
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity
        } else {
            cart.products.push({ product: pid, quantity })
        }
        await cart.save()
        res.status(200).json({ result: 'Success', message: 'Product added to cart' })
    } catch (error) {
        res.status(400).json({ result: 'Error', message: error.message })
    }
})

// PUT api/carts/:cid/products/:pid
cartsRouter.put('/api/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ result: 'Error', message: 'Cart not found' });
        }

        const existingProductIndex = cart.products.findIndex(prod => prod.product.toString() === pid);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity = quantity;
            await cart.save();
            return res.status(200).json({ result: 'Success', message: 'Product quantity updated in cart' });
        }

        return res.status(404).json({ result: 'Error', message: 'Product not found in cart' });
    } catch (error) {
        res.status(400).json({ result: 'Error', message: error.message });
    }
});

export default cartsRouter