export const isNumeric = (req, res, next) => {
  const cartId = req.params.cartId;
  const productId = req.params.productId;
  const { quantity } = req.body;

  if (!/^\d+$/.test(cartId) && cartId) {
    return res.status(400).send(`The cart ID parameter must be a number.`);
  }

  if (!/^\d+$/.test(productId) && productId) {
    return res.status(400).send(`The product ID parameter must be a number.`);
  }

  if (!/^\d+$/.test(quantity) && quantity) {
    return res.status(400).send(`The quantity must be a number.`);
  }

  req.cartId = parseInt(cartId);
  req.productId = parseInt(productId);
  req.quantity = quantity;

  next();
};
