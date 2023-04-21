const validateField = (field, fieldName, allowedTypes = []) => {
  if (!field || !allowedTypes.includes(typeof field)) {
    throw new Error(
      `Invalid ${fieldName}. It should be a: ${allowedTypes.join(", ")}`
    );
  }
};

export const validateProductFields = (req, res, next) => {
  const { method } = req;
  const { title, description, price, code, stock, status, category } = req.body;

  if (method === "POST") {
    try {
      validateField(title, "title", ["string"]);
      validateField(description, "description", ["string"]);
      validateField(price, "price", ["number"]);
      validateField(code, "code", ["string"]);
      validateField(stock, "stock", ["number"]);
      validateField(status, "status", ["boolean"]);
      validateField(category, "category", ["string"]);
    } catch (err) {
      return res.status(400).send(err.message);
    }
  } else if (method === "PUT") {
    const fieldsToValidate = {
      title: ["string"],
      description: ["string"],
      price: ["number"],
      code: ["string"],
      stock: ["number"],
      status: ["boolean"],
      category: ["string"],
    };

    try {
      for (const [fieldName, allowedTypes] of Object.entries(
        fieldsToValidate
      )) {
        if (req.body[fieldName]) {
          validateField(req.body[fieldName], fieldName, allowedTypes);
        }
      }
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  next();
};
