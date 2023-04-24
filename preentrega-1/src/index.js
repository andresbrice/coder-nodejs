import express from "express";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";

// Configuraciones
const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.use((req, res) => {
  res
    .status(404)
    .send(`The ${req.method} method or "${req.url}" route are invalid.`);
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

/* Modelo de objeto para testear rutas de productos
{
  "title": "Product title",
  "description": "Product description",
  "price": 200,
  "thumbnail": ["product-image.jpg"],
  "code": "A123",
  "stock": 50,
  "category": "Product category"
}


Modelo de objeto para testear ruta de adhesión de productos a carrito
{
  "quantity": 10
}
*/
