import { Router } from "express";
import { CartManager } from "../CartManager.js";
import { cartExists } from "../middleware/cartExists.js";
import { productExist } from "../middleware/productExists.js";
import { isNumeric } from "../middleware/isNumeric.js";

const cartManager = new CartManager("./carts.txt");

const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  try {
    const message = await cartManager.createCart();
    message == "Cart create successfully.";
    res.status(200).send(message);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error`);
  }
});

// Metodo HTTP para buscar carrito por ID o mostrar mensaje de producto inexistente
cartRouter.get("/:cartId", isNumeric, cartExists, async (req, res) => {
  try {
    const id = req.params.cartId;
    const cart = await cartManager.getCartById(parseInt(id));

    return res.status(200).send(cart);
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
  async (req, res) => {
    try {
      const cartId = parseInt(req.params.cartId);
      const productId = parseInt(req.params.productId);

      const message = await cartManager.addProductToCart(cartId, productId);
      res.status(200).send(message);
    } catch (error) {
      // console.error(error);
      res.status(500).send(`Internal Server Error`);
    }
  }
);

export default cartRouter;
