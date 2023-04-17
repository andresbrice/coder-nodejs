import { ProductManager } from "./ProductManager.js";
import express from "express";

const app = express();

const PORT = 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("./products.txt");

app.get("/", (req, res) => {
  return res.send(`This is the 'web servers' challenge by Andrés Briceño`);
});

// Método HTTP para mostrar la ruta /products con todos los productos y si hay un query param de limite que muestre la cantidad solicitada en el parametro
app.get("/products", async (req, res) => {
  try {
    const allProducts = await productManager.getProducts();
    const { limit } = req.query;

    if (limit && !/^\d+$/.test(limit)) {
      return res.send(`You must enter a number as limit.`);
    }

    const products = limit
      ? allProducts.slice(0, parseInt(limit))
      : allProducts;

    return res.send(products);
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
      return res.send(`The ID parameter must be a number.`);
    }

    const product = await productManager.getProductById(parseInt(id));
    return res.send(product);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
