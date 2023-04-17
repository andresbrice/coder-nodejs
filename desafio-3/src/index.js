import { ProductManager } from "./ProductManager.js";
import express from "express";

const app = express();

const PORT = 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("./products.txt");

// Método HTTP para mostrar la ruta /products con todos los productos y si hay un query param de limite que muestre la cantidad solicitada en el parametro
app.get("/products", async (req, res) => {
  try {
    const allProducts = await productManager.getProducts();
    const { limit } = req.query;

    if (limit && !/^\d+$/.test(limit)) {
      return res.status(400).send(`You must enter a number as limit.`);
    }

    const products = limit
      ? allProducts.slice(0, parseInt(limit))
      : allProducts;

    return res.status(200).send(products);
  } catch (error) {
    console.error(error);
  }
});

// Metodo HTTP para buscar productos por ID o mostrar mensaje de producto inexistente
app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    //en el caso que id no sea un numero devuelvo un mensaje indicando que ingrese un número
    if (!/^\d+$/.test(id)) {
      return res.status(400).send(`The ID parameter must be a number.`);
    }

    const product = await productManager.getProductById(parseInt(id));
    return res.status(200).send(product);
  } catch (error) {
    console.error(error);
  }
});

// Metodo HTTP para agregar productos
app.post("/products", async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;

    const message = await productManager.addProduct({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });
    res.status(200).send(message);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error`);
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!/^\d+$/.test(id)) {
      return res.status(400).send(`The ID parameter must be a number.`);
    }

    const { title, description, price, thumbnail, code, stock } = req.body;

    const message = await productManager.updateProduct(id, {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });

    res.status(200).send(message);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error`);
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!/^\d+$/.test(id)) {
      return res.status(400).send(`The ID parameter must be a number.`);
    }

    const message = await productManager.deleteProduct(id);
    res.status(200).send(message);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error`);
  }
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
