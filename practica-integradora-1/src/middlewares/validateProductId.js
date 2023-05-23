export const validateProductId = (req, res, next) => {
  const hasProductId = Object.prototype.hasOwnProperty.call(req.body, "id");

  if (hasProductId) {
    return res.status(400).send("Cannot modify product ID.");
  }

  next();
};
