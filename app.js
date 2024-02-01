// Importa los módulos necesarios
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const expressWs = require('express-ws');
const handlebars = require('express-handlebars');
const ProductManager = require('./ProductManager');
const fs = require('fs/promises');


//Configura el puerto
const port = 8080;

// Crea una aplicación Express
const app = express();
app.use(express.json())
const server = http.createServer(app);
const io = socketIO(server);
expressWs(app);

// Configura Handlebars como motor de plantillas
app.engine('hbs', handlebars({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

const productManager = new ProductManager();

//Websocket
app.ws('/ws', (ws, req) => {
  ws.on('message', (msg) => {
    console.log(`Mensaje recibido: ${msg}`);
    ws.send('Mensaje recibido en el servidor.');
  });
});

 // Socket.IO
 io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  // Envía la lista de productos a un nuevo cliente
  socket.emit('updateProducts', productManager.getProducts());

  // Escucha el evento cuando se agrega un nuevo producto y emite la actualización a todos los clientes
  productManager.on('productAdded', () => {
    io.emit('updateProducts', productManager.getProducts());
  });

  // Escucha el evento cuando se elimina un producto y emite la actualización a todos los clientes
  productManager.on('productDeleted', () => {
    io.emit('updateProducts', productManager.getProducts());
  });
});

// Rutas
app.get('/', (req, res) => {
  const products = productManager.getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  const products = productManager.getProducts();
  res.render('realTimeProducts', { products });
});

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

  app.post('/addProduct', (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;
        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category
        };

        // Agrega el nuevo producto utilizando el método addProduct del ProductManager
        productManager.addProduct(newProduct);

        // Emite el evento de producto agregado a través de WebSockets
        io.emit('updateProducts', productManager.getProducts());

        res.json({ message: 'Producto agregado con éxito', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});