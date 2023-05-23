import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Message = model("Message", messageSchema);
export default Message;