import { Router } from "express";
import { cartExists } from "../middlewares/cartExists.js";
import { productExists } from "../middlewares/productExists.js";
import { validateStock } from "../middlewares/validateStock.js";
import Cart from "../models/Cart.js";

const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).send(carts);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error.`);
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    await new Cart().save();
    res.status(200).send("Cart created successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error.`);
  }
});

// Metodo HTTP para buscar carrito por ID o mostrar mensaje de producto inexistente
cartRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cart = await Cart.findById(id);

    if (!cart) return res.status(404).send("Cart not found.");

    return res.status(200).send(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Internal Server Error.`);
  }
});

// Metodo HTTP para agregar un producto al carritoimport Cart from "./models/Cart";
cartRouter.post(
  "/:cartId/product/:productId",
  cartExists,
  productExists,
  validateStock,
  async (req, res) => {
    try {
      const quantity = req.quantity;
      const cart = req.cart;
      const product = req.product;

      // Agrega el producto al carrito
      cart.products.push({ productId: product._id, quantity });
      await cart.save();

      res.status(200).send("Product added to cart successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);
export default cartRouter;
