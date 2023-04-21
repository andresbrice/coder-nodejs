import { CartManager } from "../CartManager.js";

export const cartExists = async (req, res, next) => {
  try {
    const cartManager = new CartManager("./carts.txt");
    const cartId = parseInt(req.params.cartId);
    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).send(`Cart with ID ${cartId} not found.`);
    }

    req.cart = cart;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error`);
  }
};
