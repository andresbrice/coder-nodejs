import { Router } from "express";
import { ProductManager } from "../ProductManager.js";
import { validateProductFields } from "../middleware/validateProductFields.js";
import { validateProductId } from "../middleware/validateProductId.js";
import { isNumeric } from "../middleware/isNumeric.js";

const productManager = new ProductManager("./products.txt");

const productRouter = Router();

// Método HTTP para mostrar la ruta /products con todos los productos y si hay un query param de limite que muestre la cantidad solicitada en el parametro
productRouter.get("/", async (req, res) => {
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
productRouter.get("/:id", async (req, res) => {
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
productRouter.post("/", validateProductFields, async (req, res) => {
  try {
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

    const message = await productManager.addProduct({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });
    res.status(200).send(message);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error`);
  }
});

productRouter.put(
  "/:id",
  validateProductId,
  isNumeric,
  validateProductFields,
  async (req, res) => {
    try {
      const id = req.params.id;
      const { title, description, price, thumbnail, code, stock, category } =
        req.body;

      const message = await productManager.updateProduct(id, {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
      });

      res.status(200).send(message);
    } catch (error) {
      console.error(error);
      res.status(500).send(`Internal Server Error`);
    }
  }
);

productRouter.delete("/:id", async (req, res) => {
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

export default productRouter;
