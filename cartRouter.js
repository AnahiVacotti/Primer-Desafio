const express = require("express");
const router = express.Router();
const fs = require('fs');

class CartManager {
    constructor() {
      this.carts = [];
      this.path = 'carrito.json';
      this.autoIncrementId = 1;
  
      // Intenta cargar carritos desde el archivo al iniciar
      this.loadCarts();
    }
  
    loadCarts() {
      try {
        const data = fs.readFileSync(this.path, 'utf-8');
        this.carts = JSON.parse(data);
        console.log('Carritos cargados exitosamente');
      } catch (error) {
        if (error.code === 'ENOENT') {
          this.carts = [];
          console.log('El archivo de carritos no existe. Inicializando la lista de carritos.');
        } else {
          console.error('Error al intentar cargar carritos desde el archivo', error);
        }
      }
    }
  
    saveCarts() {
      try {
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
        console.log('Carritos guardados exitosamente.');
      } catch (error) {
        console.error('No se pudo actualizar el archivo de carritos', error);
      }
    }

  createCart() {
    const newCart = {
      id: this.autoIncrementId++,
      products: [],
    };
    this.carts.push(newCart);
    return newCart;
  }

  getCartById(cartId) {
    return this.carts.find((cart) => cart.id === cartId);
  }

  addProductToCart(cartId, productId) {
    const cart = this.getCartById(cartId);
    if (cart) {
      const existingProduct = cart.products.find((product) => product.product === productId);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      
      return true;
    } else {
      return false;
    }
  }


  getProductsInCart(cartId) {
    const cart = this.getCartById(cartId);
    return cart ? cart.products : null;
  }
}

const cartManager = new CartManager();

router.post("/", (req, res) => {
  try {
    const newCart = cartManager.createCart();
    cartManager.saveCarts(); // Guarda los carritos después de crear uno nuevo
    res.json({ cart: newCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear un nuevo carrito" });
  }
});

router.get("/:cartId", (req, res) => {
  try {
    const cartId = parseInt(req.params.cartId);
    const productsInCart = cartManager.getProductsInCart(cartId);

    if (!productsInCart) {
      res.status(404).json({ error: "Carrito no encontrado" });
      return;
    }

    res.json({ products: productsInCart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener los productos del carrito por ID" });
  }
});

router.post('/:cartId/product/:productId', (req, res) => {
    try {
      const cartId = parseInt(req.params.cartId);
      const productId = parseInt(req.params.productId);
  
      const isAdded = cartManager.addProductToCart(cartId, productId);
  
      if (!isAdded) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
      }

      cartManager.saveCarts(); // Guarda los carritos después de agregar un producto
  
      res.json({ message: 'Producto agregado al carrito con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al agregar el producto al carrito por ID' });
    }
  });

module.exports = router;

/*metodos de postman para carrito:
  POST /api/carts (crea un carrito nuevo)
  GET /api/carts/:cartId (devuelve los productos que contiene ese carrito)
  POST /api/carts/:cartId/product/:productId (agrega el producto :productID al carrito :cartId)
*/
