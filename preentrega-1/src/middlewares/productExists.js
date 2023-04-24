import { ProductManager } from "../ProductManager.js";

export const productExist = async (req, res, next) => {
  try {
    const productManager = new ProductManager("./products.txt");

    const product = await productManager.getProductById(req.productId);

    if (product === undefined) {
      return res
        .status(404)
        .send(`Product with ID ${req.productId} not found.`);
    }
    req.product = product;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error`);
  }
};
