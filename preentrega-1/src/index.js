import express from "express";
import productRouter from "./routes/products.routes.js";
// import cartsRouter from ".routes/carts.routes.js"
// import { __dirname } from "./path.js";

// Configuraciones
const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productRouter);
// app.use("/api/carts", cartsRouter);
// app.use("/static", express.static(__dirname + "/public"));

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

/* Modelo de objeto para testear ruta de productos
{
  "title": "prueba",
  "description": "prueba",
  "price": 200,
  "thumbnail": "",
  "code": "A1d23ef",
  "stock": 23,
  "status": true,
  "category": "prueba"
}
*/
