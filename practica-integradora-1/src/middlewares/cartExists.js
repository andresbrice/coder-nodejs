import Cart from "../models/Cart.js";

export const cartExists = async (req, res, next) => {
  try {
    // Encuentra el carrito por su ID
    const cartId = req.params.cartId;
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    req.cart = cart;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error`);
  }
};
