import { promises as fs } from "fs";
import { Cart } from "./Cart.js";

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  async generateCartId() {
    const carts = await this.getCarts();
    const lastCart = carts[carts.length - 1];
    const lastID = lastCart ? lastCart.id : 0;
    const newID = lastID + 1;
    return newID;
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
      // genero id autoincremental segun el ultimo id del archivo
      const newCartId = await this.generateCartId();

      const cart = new Cart();

      cart.id = newCartId;
      carts.push(cart);

      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");

      return "Cart created successfully.";
    } catch (error) {
      return "There was a problem creating cart.";
    }
  }

  async getCarts() {
    //Retorno todos los productos que leo de forma asincronica desde el path
    try {
      const carts = await fs.readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getCartById(id) {
    try {
      // Retorno producto segun su id
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === parseInt(id));
      return cart;
    } catch (error) {
      console.error(error);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === parseInt(cartId));

      const productIndex = cart.products.findIndex(
        (p) => p.id === parseInt(productId)
      );

      if (productIndex >= 0) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ id: parseInt(productId), quantity: 1 });
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
    }
  }
}
