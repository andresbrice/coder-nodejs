import { Router } from "express";
import { ProductManager } from "../ProductManager.js";
import { validateProductFields } from "../middlewares/validateProductFields.js";
import { validateProductId } from "../middlewares/validateProductId.js";
import { isNumeric } from "../middlewares/isNumeric.js";
import { validateLimit } from "../middlewares/validateLimit.js";
import { productExist } from "../middlewares/productExists.js";

const productManager = new ProductManager("./products.txt");
const productRouter = Router();

// Método HTTP para mostrar la ruta /products con todos los productos y si hay un query param de limite que muestre la cantidad solicitada en el parametro
productRouter.get("/", validateLimit, async (req, res) => {
  try {
    const allProducts = await productManager.getProducts();
    const limit = req.limit;

    const products = limit
      ? allProducts.slice(0, parseInt(limit))
      : allProducts;

    res.render("home", { title: "Product's List", products: products });

    // return res.status(200).send(products);
  } catch (error) {
    console.error(error);
  }
});

productRouter.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();

  res.render("realtimeproducts", {
    title: "Product's List in real time",
    products: products,
    realtimeproducts: true,
  });
});

// Metodo HTTP para buscar productos por ID o mostrar mensaje de producto inexistente
productRouter.get("/:productId", isNumeric, productExist, async (req, res) => {
  try {
    const product = await productManager.getProductById(req.product.id);
    return res.status(200).send(product);
  } catch (error) {
    console.error(error);
  }
});

// Metodo HTTP para agregar productos
productRouter.post("/", validateProductFields, async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock, category } =
      req.body;

    const message = await productManager.addProduct({
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
});

productRouter.put(
  "/:productId",
  isNumeric,
  validateProductId,
  validateProductFields,
  async (req, res) => {
    try {
      const id = req.productId;
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

productRouter.delete(
  "/:productId",
  isNumeric,
  validateProductId,
  async (req, res) => {
    try {
      const id = req.productId;
      const message = await productManager.deleteProduct(id);
      res.status(200).send(message);
    } catch (error) {
      console.error(error);
      res.status(500).send(`Internal Server Error`);
    }
  }
);

export default productRouter;
