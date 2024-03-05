import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";

const productsRouter = Router();

//Render on front with handlebars with IO
productsRouter.get("/", async (req, res) => {
  try {
    const allProducts = await productModel.find({}, { _id: 0, __v: 0 }).lean(); //We ensure flat javascript objects and not complex mongoose prototypes
    res.render("home", {
      style: "/css/styles.css",
      title: "All Products",
      allProducts,
    });
  } catch (error) {
    res.status(400).send("Internal server Error", error);
  }
});

//Render products in real time with ws
productsRouter.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    style: "/css/styles.css",
  });
});

//All or with limit
productsRouter.get("/api/products", async (req, res) => {
  const { limit } = req.query;
  try {
    const products = await productModel.find().limit(limit);
    res.status(200).send({ result: "Success", message: products });
  } catch (error) {
    req.status(400).send({
      response: "Error read db",
      message: error,
    });
  }
});

//See With ID
productsRouter.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send({ result: "Success", message: product });
  } catch (error) {
    res.status(404).send({ result: "Error", message: "Not found" });
  }
});

productsRouter.get("/products", (req, res) => {
    res.redirect("/products/1");
  });

//rutaprueba
productsRouter.get("/products/:page", async (req, res) => {
    try {
      const page = req.params.page ? parseInt(req.params.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 5;
      const sortOrder = req.query.sort ? req.query.sort : null;
      const category = req.query.category ? req.query.category : null;
  
      const sortOptions = {};
      if (sortOrder) {
        // Verifica si sortOrder es 'asc' o 'desc' y establece el orden correspondiente
        sortOptions.createdAt = sortOrder === 'desc' ? -1 : 1;
      }
  
      const result = await productModel.paginate(
        {},
        { page, limit, lean: true, sort: sortOptions }
      );
  
      // Construir enlaces de paginación
      result.prevLink = result.hasPrevPage
        ? `/products/${result.prevPage}?limit=${limit}&sort=${sortOrder}&category=${category}`
        : "";
      result.nextLink = result.hasNextPage
        ? `/products/${result.nextPage}?limit=${limit}&sort=${sortOrder}&category=${category}`
        : "";
      result.isValid = !(page <= 0 || page > result.totalPages);
  
      res.render("products", {
        allProducts: result.docs,
        result,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });

//Add new product
productsRouter.post("/api/products", async (req, res) => {
  const { title, description, price, thumbnail, code, stock, category } =
    req.body;

  try {
    let prod = await productModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
    });
    res.status(200).send({ result: "Success", message: prod });
  } catch (error) {
    res.status(400).send({
      result: "Error create product",
      message: error.message,
    });
  }
});

//Update product
productsRouter.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category,
  } = req.body;

  try {
    const product = await productModel.findByIdAndUpdate(id, {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });

    if (!product) {
      return res
        .status(404)
        .send({ result: "Error", message: "Product not found" });
    }
    res.status(200).send({ result: "OK", message: "Product updated" });
  } catch (error) {
    res.status(400).send({ result: "Error updating product", message: error });
  }
});

//Delete Product
productsRouter.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .send({ result: "Error", message: "Product not found" });
    }
    res
      .status(200)
      .send({ result: "Success", message: "Product deleted", product });
  } catch (error) {
    res.status(400).send({ result: "Error deleting product", message: error });
  }
});

export default productsRouter;
