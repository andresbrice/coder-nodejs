import express from "express";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import { engine } from "express-handlebars";
import * as path from "path";
import { __dirname, __filename } from "./path.js";
import { Server } from "socket.io";
import { ProductManager } from "./ProductManager.js";

// Configuraciones
const app = express();
const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
const productManager = new ProductManager("./products.txt");
// ServerIO
const io = new Server(server);

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// Routes
app.use("/", express.static(__dirname + "/public"));
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use((req, res) => {
  res
    .status(404)
    .send(`The ${req.method} method or "${req.url}" route are invalid.`);
});

io.on("connection", (socket) => {
  console.log("The client has been connected.");

  socket.on("disconnect", () => {
    console.log("The client has been disconnected");
  });

  socket.on("addProduct", async (product, callback) => {
    try {
      const existingProduct = await productManager.validateProduct(
        product.code
      );
      if (existingProduct) {
        throw new Error(existingProduct);
      }
      const message = await productManager.addProduct(product);
      const products = await productManager.getProducts();
      socket.emit("updateProductList", products);
      callback(null, message);
      console.log(message);
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on("deleteProduct", async (id) => {
    const message = await productManager.deleteProduct(id);
    const products = await productManager.getProducts();
    socket.emit("updateProductList", products);
    console.log(message);
  });
});
