import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: {
    type: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});

const Cart = model("Cart", cartSchema);
export default Cart;
