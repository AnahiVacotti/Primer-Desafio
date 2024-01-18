const fs = require ("fs");

 class ProductManager {
    constructor () {
        this.products = []
        this.path = "products.json";
    }

    addProduct (product) { 
    this.getProducts()
    const {title, description, price, thumbnail, code, stock} = product;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Todos los campos son obligatorios")
        return;
    }
    if(this.products.some ((p) => p.code=== code)) {
        console.log("El codigo ya existe.");
        return;
    }

    const id = this.setId ();
    this.products.push ({id, ...product});
    try {
       fs.writeFileSync (this.path, JSON.stringify(this.products));
       console.log("Datos guardados con exito.")
    } catch (error) {
        console.error ("Error al escribir el archivo", error)
    }


   }

   getProducts() {
    try {
        if(fs.accessSync (this.path)) {
        const data = fs.readFileSync(this.path, "utf8");
        this.products = JSON.parse(data);
        console.log ("Archivo leido exitosamente")
     }
    } catch (error) {
        console.log ("Error al intentar leer el archivo", error)
        
    }
    return this.products;
   }

   getProductsById (id) {
    this.getProducts();
    const product = this.products.find((p) => p.id === id)
    if (product === undefined) {
       console.log (`El producto con el id ${id} no existe`);
    }
    else return product;
   }

   setId() {
    this.lastId = this.getLastProductId();
    if (this.lastId === 0) this.lastId = 1;
    else this.lastId ++;
    return this.lastId;
   }

   getLastProductId (){
    if(this.products.length === 0) return 0;
    const lastProductId = this.products[this.products.length - 1].id;
    console.log ("El ultimo id es", lastProductId)
    return lastProductId;
   }

   updateProduct(id, productActualizado) {
    this.getProducts();
    if(this.products.find((product) => product.id === id)===undefined){
        console.error (`El id ${id} no existe.`);
        return;
    }

    const indice = this.products.findIndex((product) => product.id === id);
    this.products[indice] = {id, ...productActualizado};

    try {
        fs.writeFileSync(this.path, JSON.stringify (this.products))
        console.log ("Archivo actualizado")
    } catch (error) {
        console.error("No se pudo actualizar el archivo", error);   
  }
}
 deleteProduct(id) {
    this.getProducts();

    if(this.products.find((product) => product.id === id)===undefined){
        console.error (`El id ${id} no existe.`);
        return;
    }
    const indice = this.products.findIndex(product => product.id === id);
    this.products.splice(indice, 1);
    try {
        fs.writeFileSync(this.path, JSON.stringify(this.products))
        console.log ("Producto eliminado")
    } catch (error) {
        console.error("Error al intentar eliminar el producto");
        
    }
  }
  
  getLimitedProducts(limit) {
    return this.products.slice(0, limit);
  }
}

    const productManager = new ProductManager();
    const product1 = {
    title: "Titulo",
    description: "Descripcion",
    price: 125,
    thumbnail: "Miniatura",
    code: "abc",
    stock: 5,
 };

 
 
let misProductos = productManager.getProducts()
console.log (misProductos);

const product2 = {
    title: "Titulo2",
    description: "Descripcion2",
    price: 1250,
    thumbnail: "Miniatura2",
    code: "xzy",
    stock: 3,
 }; 
 const product3 = {
    title: "Titulo3",
    description: "Descripcion3",
    price: 1550,
    thumbnail: "Miniatura3",
    code: "klm",
    stock: 7,

 };
 productManager.addProduct (product1);
 const pd= productManager.getProductsById(1)
console.log (pd);

 productManager.addProduct (product2);
 productManager.addProduct (product3);
 productManager.updateProduct (1, product2);


 productManager.deleteProduct(2)
 misProductos = productManager.getProducts();
 console.log(misProductos);














//readFileSync (lectura de archivos)
//writeFileSync (escritura de archivos)
//appendFileSync (actualizacion de archivos)
//unlinkSync(borrado de archivo)
//mkdirSync (crear carpeta)