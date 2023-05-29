import { Schema, model } from "mongoose";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema);
export default User;
