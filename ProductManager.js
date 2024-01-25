const fs = require("fs");

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "products.json";
  }

  saveProducts() {
    try {
      fs.writeFileSync(
        this.path,
        JSON.stringify(this.products, null, 2),
        "utf-8"
      );
      console.log("Datos guardados con éxito.");
    } catch (error) {
      console.error("No se pudo actualizar el archivo", error);
    }
  }

  addProduct(product) {
    const { title, description, code, price, stock, category, thumbnails } =
      product;

    if (!title || !description || !code || !price || !stock || !category) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    const newProduct = {
      id: this.setId(),
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || [], // Si no se proporciona thumbnails, establecemos un array vacío
    };

    this.products.push(newProduct);
    this.saveProducts();
    console.log("Producto agregado con éxito.");
    return newProduct;
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      this.products = JSON.parse(data);
      console.log("Archivo leído exitosamente");
    } catch (error) {
      if (error.code === "ENOENT") {
        // Si el archivo no existe, inicializamos la lista de productos como un array vacío
        this.products = [];
        console.log(
          "El archivo no existe. Inicializando la lista de productos."
        );
      } else {
        console.error("Error al intentar leer el archivo", error);
      }
    }
    return this.products;
  }

  getProductsById(id) {
    this.getProducts();
    console.log(this.products);
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      console.log(`El producto con el id ${id} no existe`);
    } else {
      return product;
    }
  }

  setId() {
    this.lastId = this.getLastProductId();
    if (this.lastId === 0) this.lastId = 1;
    else this.lastId++;
    return this.lastId;
  }

  getLastProductId() {
    if (this.products.length === 0) return 0;
    const lastProductId = this.products[this.products.length - 1].id;
    console.log("El ultimo id es", lastProductId);
    return lastProductId;
  }

  updateProduct(id, productActualizado) {
    this.getProducts();
    if (this.products.find((product) => product.id === id) === undefined) {
      console.error(`El id ${id} no existe.`);
      return;
    }

    const indice = this.products.findIndex((product) => product.id === id);
    this.products[indice] = { id, ...productActualizado };

    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products));
      console.log("Archivo actualizado");
    } catch (error) {
      console.error("No se pudo actualizar el archivo", error);
    }
  }
  deleteProductById(id) {
    this.getProducts();
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      console.log(`El producto con el id ${id} no existe. No se puede eliminar.`);
      return false; // Devolver false si el producto no existe
    }

    this.products.splice(productIndex, 1);
    this.saveProducts();
    console.log(`Producto con id ${id} eliminado con éxito.`);
    return true;
  }

  getLimitedProducts(limit) {
    return this.products.slice(0, limit);
  }
}

module.exports = ProductManager;

/*const productManager = new ProductManager();




const product1 = {
  title: "Titulo",
  description: "Descripcion",
  price: 125,
  thumbnail: "Miniatura",
  code: "abc",
  stock: 5,
  category: "Ropa",
};

let misProductos = productManager.getProducts();

console.log(misProductos);

const product2 = {
  title: "Titulo2",
  description: "Descripcion2",
  price: 1250,
  thumbnail: "Miniatura2",
  code: "xzy",
  stock: 3,
  category: "Ropa",
};
const product3 = {
  title: "Titulo3",
  description: "Descripcion3",
  price: 1550,
  thumbnail: "Miniatura3",
  code: "klm",
  stock: 7,
  category: "Ropa",
};
const product4 = {
  title: "Titulo4",
  description: "Descripcion4",
  price: 1550,
  thumbnail: "Miniatura4",
  code: "klm",
  stock: 7,
  category: "Ropa",
};
const product5 = {
  title: "Titulo5",
  description: "Descripcion5",
  price: 1550,
  thumbnail: "Miniatura5",
  code: "klm",
  stock: 7,
  category: "Ropa",
};



productManager.addProduct(product1);
const pd = productManager.getProductsById(1);
console.log(pd);

productManager.addProduct(product2);
productManager.addProduct(product3);
productManager.addProduct(product5);
productManager.addProduct(product4);
productManager.updateProduct(1, product2);

productManager.deleteProductById(2);
misProductos = productManager.getProducts();
console.log(misProductos);

//readFileSync (lectura de archivos)
//writeFileSync (escritura de archivos)
//appendFileSync (actualizacion de archivos)
//unlinkSync(borrado de archivo)
//mkdirSync (crear carpeta)*/
