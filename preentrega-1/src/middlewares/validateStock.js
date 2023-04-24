import { ProductManager } from "../ProductManager.js";

export const validateStock = async (req, res, next) => {
  try {
    const {
      product,
      body: { quantity },
    } = req;

    if (quantity === undefined || isNaN(quantity)) {
      return res
        .status(400)
        .send("The quantity is required and must be a number");
    }

    if (product.stock < quantity) {
      return res.status(400).send(`There isn't enough stock.`);
    }

    const productManager = new ProductManager("./products.txt");

    product.stock -= quantity;

    if (product.stock === 0) {
      product.status = false;
    }

    await productManager.updateProduct(product.id, product);
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};
