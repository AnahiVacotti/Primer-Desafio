const express = require('express');
const fs = require('fs/promises');
const app = express();
const port = 8080;

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
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});