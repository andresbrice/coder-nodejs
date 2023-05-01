import { CartManager } from "../CartManager.js";

export const cartExists = async (req, res, next) => {
  try {
    const cartManager = new CartManager("./carts.txt");
    const cart = await cartManager.getCartById(req.cartId);

    if (cart === undefined) {
      return res.status(404).send(`Cart with ID ${req.cartId} not found.`);
    }

    req.cart = cart;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error`);
  }
};
