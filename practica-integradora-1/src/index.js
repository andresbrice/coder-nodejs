/* *****************************  IMPORTACIONES  ********************************** */
import express from "express";
import { engine } from "express-handlebars";
import * as path from "path";
import { Server } from "socket.io";
import mongoose from "mongoose";
import "dotenv/config";
// import { socketMiddleware } from "./middlewares/socket.js";

// Rutas
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import messageRouter from "./routes/messages.routes.js";

// Managers
import { ProductManager } from "./ProductManager.js";

// PATH
import { __dirname, __filename } from "./path.js";

/* *****************************  MONGODB  ******************************************* */
mongoose
  .connect(process.env.URL_MONGODB_ATLAS)
  .then(() => console.log("DB is connected"))
  .catch((error) => console.log(`Error: ${error}`));

/* *****************************  CONFIGURACIONES  ********************************** */
const app = express();
const server = app.listen(process.env.PORT, () => {
  console.log(`Server on port ${process.env.PORT}`);
});
const io = new Server(server);

// const productManager = new ProductManager("./products.txt");

/* ************************  HANDLEBARS ********************************************* */
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

/* ************************  MIDDLEWARES ******************************************** */
const socketMiddleware = (req, res, next) => {
  req.io = io;
  next();
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(socketMiddleware);

/* ************************  RUTAS  ************************************************* */
app.use("/", express.static(__dirname + "/public"));
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/chat", messageRouter);
app.use((req, res) => {
  res
    .status(404)
    .send(`The ${req.method} method or "${req.url}" route are invalid.`);
});

/* ************************  SOCKET.IO  ********************************************* */

// io.on("connection", (socket) => {
//   console.log("The client has been connected.");

//   socket.on("disconnect", () => {
//     console.log("The client has been disconnected");
//   });

//   socket.on("addProduct", async (product, callback) => {
//     try {
//       const existingProduct = await productManager.validateProduct(
//         product.code
//       );
//       if (existingProduct) {
//         throw new Error(existingProduct);
//       }
//       const message = await productManager.addProduct(product);
//       const products = await productManager.getProducts();
//       socket.emit("updateProductList", products);
//       callback(null, message);
//       console.log(message);
//     } catch (error) {
//       callback(error.message);
//     }
//   });

//   socket.on("deleteProduct", async (id) => {
//     const message = await productManager.deleteProduct(id);
//     const products = await productManager.getProducts();
//     socket.emit("updateProductList", products);
//     console.log(message);
//   });
// });
