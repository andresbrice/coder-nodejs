const validationRules = {
  POST: {
    requiredFields: [
      "title",
      "description",
      "price",
      "code",
      "stock",
      "category",
    ],
    types: {
      title: "string",
      description: "string",
      price: "number",
      code: "string",
      stock: "number",
      category: "string",
    },
  },
  PUT: {
    requiredFields: [],
    types: {
      title: "string",
      description: "string",
      price: "number",
      code: "string",
      stock: "number",
      category: "string",
    },
  },
};

export const validateProductFields = (req, res, next) => {
  const method = req.method;

  const { requiredFields, types } = validationRules[method];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    const message = `${missingFields.join(", ")} ${
      missingFields.length > 1 ? "are" : "is"
    } required.`;
    const errorMessage = message.charAt(0).toUpperCase() + message.slice(1);
    return res.status(400).send(errorMessage);
  }

  const invalidFields = Object.keys(req.body).filter(
    (field) => types[field] && typeof req.body[field] !== types[field]
  );

  if (invalidFields.length > 0) {
    const message = invalidFields.map(
      (field) => `${field} must be of type ${types[field]}`
    );
    const errorMessage = message.join(", ");
    const capitalizedMessage =
      errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
    return res.status(400).send(capitalizedMessage);
  }

  next();
};
