import { Router } from "express";

// Modelo de producto
import Product from "../models/Product.js";

// Middlewares
import { validateLimit } from "../middlewares/validateLimit.js";
import { productExists } from "../middlewares/productExists.js";

const productRouter = Router();

// Método HTTP para mostrar la ruta /products con todos los productos y si hay un query param de limite que muestre la cantidad solicitada en el parametro
productRouter.get("/", validateLimit, async (req, res) => {
  try {
    const allProducts = await Product.find();
    const limit = req.limit;

    const products = limit
      ? allProducts.slice(0, parseInt(limit))
      : allProducts;

    res.render("home", { title: "Product's List", products: products });

    return res.status(200).send(products);
  } catch (error) {
    console.error(error);
  }
});

productRouter.get("/realtimeproducts", async (req, res) => {
  const products = await Product.find();
  res.render("realtimeproducts", {
    title: "Product's List in real time",
    products: products,
    realtimeproducts: true,
  });
});

// Metodo HTTP para buscar productos por ID
productRouter.get("/:productId", productExists, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    res.status(200).send(product);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Metodo HTTP para agregar productos
productRouter.post("/", async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock, category } =
      req.body;

    const existingProduct = await Product.findOne({ code: code });

    if (existingProduct) {
      return res.status(400).send("Product code already exists");
    } else {
      const newProduct = new Product({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
      });

      await newProduct.save();

      res.status(201).send("Product added successfully");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error`);
  }
});

// Metodo HTTP para modificar productos
productRouter.put("/:productId", productExists, async (req, res) => {
  try {
    const id = req.product._id;
    const { title, description, price, thumbnail, code, stock, category } =
      req.body;

    await Product.findByIdAndUpdate(id, {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
    });

    const updatedProduct = await Product.findById(id);

    if (req.product.stock === 0 && updatedProduct.stock > 0) {
      updatedProduct.status = true;
      await updatedProduct.save();
    }

    res.status(200).send("Product updated successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Metodo HTTP para eliminar productos
productRouter.delete("/:productId", async (req, res) => {
  try {
    const id = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }

    return res.status(200).send("Product deleted sucessfully.");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export default productRouter;
