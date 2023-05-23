import { Router } from "express";
import Message from "../models/Message.js";

const messageRouter = Router();

messageRouter.get("/", async (req, res) => {
  try {
    const messages = await Message.find().lean();
    console.log(messages);
    res.render("chat", { title: "Chat", messages: messages, chat: true });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

messageRouter.post("/send", async (req, res) => {
  try {
    const { user, message } = req.body;

    // Guarda el mensaje en la base de datos utilizando Mongoose
    const newMessage = await Message.create({ user, message });

    // Obtén todos los mensajes de la base de datos
    const messages = await Message.find().lean();

    // Envía los mensajes actualizados a todos los clientes conectados
    req.io.emit("receiveMessages", messages);

    res.redirect("/");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export default messageRouter;
