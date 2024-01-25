const express = require('express');
const ProductManager = require('./ProductManager');
const fs = require('fs/promises');
const app = express();
const port = 8080;
app.use(express.json());
// Importa el enrutador del carrito
const cartRouter = require('./cartRouter');
// Usa el enrutador del carrito en la ruta '/api/carts'
app.use('/api/carts', cartRouter);

const productManager = new ProductManager();

app.get('/products', async (req, res) => {
    try {
      // Lee el archivo de productos
      const data = await fs.readFile('products.json', 'utf-8');
      const productos = JSON.parse(data);
  
      // Obtiene el valor del parámetro de consulta 'limit'
      const limit = parseInt(req.query.limit);
  
      // Verifica si el 'limit' es un número válido y mayor que cero
      const esLimiteValido = limit && !isNaN(limit) && limit > 0;
  
      if (esLimiteValido) {
        // Si el 'limit' es válido, verifica que no sea mayor que la cantidad total de productos
        const estaEnRango = limit <= productos.length && limit >= 0;
  
        if (!estaEnRango) {
          throw new Error('El valor de "limit" está fuera del rango permitido');
        }
  
        const productosConLimite = productos.slice(0, limit);
  
        // Devuelve los productos limitados como un objeto JSON
        res.json({ products: productosConLimite });
      } else {
        // Si no se proporciona un límite, devuelve todos los productos
        res.json({ products: productos });
      }
    } catch (error) {
      // Maneja errores, por ejemplo, si el archivo no existe
      console.error(error);
      res.status(500).json({ error: 'Error al leer los productos' });
    }
  });

  app.get('/products/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const product = await productManager.getProductsById(productId);
  
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
  
      res.json({ product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el producto por ID' });
    }
  });

  app.delete('/products/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const isDeleted = await productManager.deleteProductById(productId);
  
      if (!isDeleted) {
        res.status(404).json({ error: 'Producto no encontrado. No se pudo eliminar.' });
        return;
      }
  
      res.json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el producto por ID' });
    }
  });

  app.put('/:pid', (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const productToUpdate = productManager.getProductsById(productId);
  
      if (!productToUpdate) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
  
      const updatedFields = req.body;
      // Asegúrate de que el ID no se actualice
      delete updatedFields.id;
  
      // Actualiza los campos del producto con los valores proporcionados
      Object.assign(productToUpdate, updatedFields);
  
      // Guarda los productos actualizados en el archivo
      productManager.saveProducts();
  
      res.json({ message: 'Producto actualizado con éxito', product: productToUpdate });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  });

  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});