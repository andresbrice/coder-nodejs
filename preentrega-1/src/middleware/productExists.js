import { ProductManager } from "../ProductManager.js";

export const productExist = async (req, res, next) => {
  try {
    const productManager = new ProductManager("./products.txt");
    const productId = parseInt(req.params.productId);
    const product = await productManager.getProductById(productId);

    if (!product) {
      return res.status(404).send(`Product with ID ${productId} not found.`);
    }
    req.product = product;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error`);
  }
};
