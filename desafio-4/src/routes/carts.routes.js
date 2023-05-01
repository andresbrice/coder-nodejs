import { Router } from "express";
import { CartManager } from "../CartManager.js";
import { cartExists } from "../middlewares/cartExists.js";
import { productExist } from "../middlewares/productExists.js";
import { isNumeric } from "../middlewares/isNumeric.js";
import { validateStock } from "../middlewares/validateStock.js";

const cartManager = new CartManager("./carts.txt");

const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  try {
    const message = await cartManager.createCart();
    res.status(200).send(message);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error`);
  }
});

// Metodo HTTP para buscar carrito por ID o mostrar mensaje de producto inexistente
cartRouter.get("/:cartId", isNumeric, cartExists, async (req, res) => {
  try {
    return res.status(200).send(req.cart);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Internal Server Error`);
  }
});

// Metodo HTTP para agregar un producto al carrito
cartRouter.post(
  "/:cartId/product/:productId",
  isNumeric,
  cartExists,
  productExist,
  validateStock,
  async (req, res) => {
    try {
      const message = await cartManager.addProductToCart(
        req.cart.id,
        req.product.id,
        req.quantity
      );
      res.status(200).send(message);
    } catch (error) {
      // console.error(error);
      res.status(500).send(`Internal Server Error`);
    }
  }
);

export default cartRouter;
