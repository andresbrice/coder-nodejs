const validateField = (field, fieldName, fieldType) => {
  if (!field || typeof field !== fieldType) {
    throw new Error(`Invalid ${fieldName}. It should be a ${fieldType}`);
  }
};

export const validateFields = (req, res, next) => {
  const { method } = req;
  const { title, description, price, code, stock, status, category } = req.body;

  if (method === "POST") {
    try {
      validateField(title, "title", "string");
      validateField(description, "description", "string");
      validateField(price, "price", "number");
      validateField(code, "code", "string");
      validateField(stock, "stock", "number");
      validateField(status, "status", "boolean");
      validateField(category, "category", "string");
    } catch (err) {
      return res.status(400).send(err.message);
    }
  } else if (method === "PUT") {
    try {
      if (title) {
        validateField(title, "title", "string");
      }
      if (description) {
        validateField(description, "description", "string");
      }
      if (price) {
        validateField(price, "price", "number");
      }
      if (code) {
        validateField(code, "code", "string");
      }
      if (stock) {
        validateField(stock, "stock", "number");
      }
      if (status) {
        validateField(status, "status", "boolean");
      }
      if (category) {
        validateField(category, "category", "string");
      }
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  next();
};
