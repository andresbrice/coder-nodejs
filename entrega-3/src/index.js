import { ProductManager } from "./ProductManager.js";
import express from "express";

const productManager = new ProductManager("./products.txt");

const app = express();

const PORT = 4000;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Desafio Servidores web");
});

// Método HTTP para mostrar la ruta /products con todos los productos y si hay un query param de limite que muestre la cantidad solicitada en el parametro
app.get("/products", async (req, res) => {
  try {
    const allProducts = await productManager.getProducts();
    const { limit } = req.query;

    if (!limit || !/^\d+$/.test(limit)) {
      res.send(JSON.stringify(allProducts));
    } else {
      const productsLimited = allProducts.slice(0, parseInt(limit));
      res.send(JSON.stringify(productsLimited));
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
        res.send(`No existe un producto con ID ${pid} `);
      } else {
        res.send(JSON.stringify(product));
      }
    } else {
      res.send(`Debe ingresar un ID númerico`);
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
