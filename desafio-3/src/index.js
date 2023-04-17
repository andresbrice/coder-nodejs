import { ProductManager } from "./ProductManager.js";
import express from "express";

const app = express();

const PORT = 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("./products.txt");

app.get("/", (req, res) => {
  res.send(`This is the 'web servers' challenge by Andrés Briceño`);
});

// Método HTTP para mostrar la ruta /products con todos los productos y si hay un query param de limite que muestre la cantidad solicitada en el parametro
app.get("/products", async (req, res) => {
  try {
    const allProducts = await productManager.getProducts();
    const { limit } = req.query;

    if (!limit || !/^\d+$/.test(limit)) {
      res.send(allProducts);
    } else {
      const productsLimited = allProducts.slice(0, parseInt(limit));
      res.send(productsLimited);
    }
  } catch (error) {
    console.error(error);
  }
});

// Metodo HTTP para buscar productos por ID o mostrar mensaje de producto inexistente
app.get("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;

    if (/^\d+$/.test(pid)) {
      //en el caso que pid sea un numero devueolvo obtengo el producto desde el archivo .txt
      const product = await productManager.getProductById(parseInt(pid));
      if (!product) {
        res.send(`There isn't a product with ID ${pid} `);
      } else {
        res.send(product);
      }
    } else {
      res.send(`You must enter a numeric ID`);
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
