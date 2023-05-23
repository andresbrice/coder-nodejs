import Product from "../models/Product.js";

export const validateStock = async (req, res, next) => {
  try {
    const quantity = req.body.quantity;
    const product = req.product; // Utiliza el producto asignado en el middleware productExists

    if (typeof quantity !== "number") {
      return res.status(400).send("Quantity must be a number");
    }

    if (product.stock < quantity) {
      return res.status(400).send("Insufficient stock");
    }

    product.stock -= quantity;

    if (product.stock === 0) {
      product.status = false;
    }

    await product.save();
    req.quantity = quantity;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};
