export const isNumeric = (req, res, next) => {
  const cartId = req.params.cartId;
  const productId = req.params.productId;

  if (!/^\d+$/.test(cartId) && req.params.cartId) {
    return res.status(400).send(`The cart ID parameter must be a number.`);
  }

  if (!/^\d+$/.test(productId) && req.params.productId) {
    return res.status(400).send(`The product ID parameter must be a number.`);
  }

  next();
};
