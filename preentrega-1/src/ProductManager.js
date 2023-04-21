import { Product } from "./Product.js";
import { promises as fs } from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async generateProductId() {
    const products = await this.getProducts();
    const lastProduct = products[products.length - 1];
    const lastID = lastProduct ? lastProduct.id : 0;
    const newID = lastID + 1;
    return newID;
  }

  async validateProduct(code) {
    const products = await this.getProducts();
    if (products.length === 0) return null;

    const productExist = products.find((prod) => prod.code === code);
    if (productExist) return `The product code "${code}" already exists.`;
  }

  async addProduct(newProduct) {
    try {
      // valido que no exista el producto en el archivo segun su codigo
      const validationMessage = await this.validateProduct(newProduct.code);
      if (validationMessage) return validationMessage;

      const products = await this.getProducts();
      // genero id autoincremental segun el ultimo id del archivo
      const newProductId = await this.generateProductId();

      const product = new Product(
        newProduct.title,
        newProduct.description,
        newProduct.price,
        newProduct.thumbnail,
        newProduct.code,
        newProduct.stock,
        newProduct.status,
        newProduct.category
      );

      product.id = newProductId;
      products.push(product);

      await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");

      return "Product added successfully.";
    } catch (error) {
      console.error(error);
    }
  }

  async getProducts() {
    //Retorno todos los productos que leo de forma asincronica desde el path
    try {
      const products = await fs.readFile(this.path, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      // Retorno producto segun su id
      const products = await this.getProducts();
      const product = products.find((prod) => prod.id === parseInt(id));
      return product;
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(id, newData) {
    try {
      // Consulto todos los productos y busco el index del producto a modificar
      const products = await this.getProducts();
      const productIndex = products.findIndex((p) => p.id === parseInt(id));

      if (productIndex === -1) {
        return "Product not found";
      }

      const updatedData = {};
      // recorro la nueva data a actualizar y la actualizo en caso que la key no sea undefined
      Object.keys(newData).forEach((key) => {
        if (newData[key] !== undefined) {
          updatedData[key] = newData[key];
        }
      });

      const updatedProduct = {
        ...products[productIndex],
        ...updatedData,
      };

      products[productIndex] = updatedProduct;

      await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");

      return "Product updated successfully";
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const indexToDelete = products.findIndex(
        (prod) => prod.id === parseInt(id)
      );

      if (indexToDelete === -1) {
        return "Product not found.";
      }

      products.splice(indexToDelete, 1);

      await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");

      return "Product deleted successfully.";
    } catch (error) {
      console.error(error);
    }
  }
}
