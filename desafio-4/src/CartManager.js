import { promises as fs } from "fs";
import { Cart } from "./Cart.js";

export class CartManager {
  constructor(path) {
    this.path = path;
  }
  async generateCartId() {
    try {
      const carts = await this.getCarts();
      const lastCart = carts[carts.length - 1];
      const lastID = lastCart ? lastCart.id : 0;
      const newCartID = lastID + 1;
      return newCartID;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
  async createCart() {
    try {
      const carts = await this.getCarts();
      const newCartId = await this.generateCartId();
      const cart = new Cart();

      cart.id = newCartId;

      carts.push(cart);

      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");

      return "Cart created successfully.";
    } catch (error) {
      console.error(error);
      return "There was a problem creating the cart. Please try again later.";
    }
  }
  async getCarts() {
    let carts = [];
    try {
      const file = await fs.readFile(this.path, "utf-8");
      carts = JSON.parse(file);
    } catch (error) {
      console.error(error);
    }
    return carts;
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === parseInt(id));
      return cart || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(parseInt(cartId));

      const productIndex = cart.products.findIndex(
        (p) => p.id === parseInt(productId)
      );

      if (productIndex >= 0) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ id: parseInt(productId), quantity: quantity });
      }

      await this.updateCart(cart);

      return "Cart updated successfully.";
    } catch (error) {
      console.error(error);
    }
  }

  async updateCart(cart) {
    try {
      const carts = await this.getCarts();
      const index = carts.findIndex((c) => c.id === cart.id);

      if (index >= 0) {
        carts[index] = cart;
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");
      } else {
        return "Cart not found.";
      }
    } catch (error) {
      console.error(error);
      return "There was a problem updating cart.";
    }
  }
}
