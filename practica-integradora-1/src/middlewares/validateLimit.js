export const validateLimit = (req, res, next) => {
  const { limit } = req.query;

  if (limit && !/^\d+$/.test(limit)) {
    return res.status(400).send(`You must enter a number as limit.`);
  }

  req.limit = limit;

  next();
};
