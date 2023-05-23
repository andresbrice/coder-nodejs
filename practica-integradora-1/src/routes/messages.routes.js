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

messageRouter.io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("message", async (data) => {
    try {
      const { user, message } = data;

      await Message.create({ user, message });

      const messages = await Message.find().lean();

      messageRouter.io.emit("messages", messages);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("The client has been disconnected");
  });
});

export default messageRouter;
