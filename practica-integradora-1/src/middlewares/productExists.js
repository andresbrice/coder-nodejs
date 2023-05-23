import Product from "../models/Product.js";

export const productExists = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    // Encuentra el producto por su ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    req.product = product;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error`);
  }
};
