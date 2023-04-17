import { Product } from "./Product.js";
import { promises as fs } from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  async createFileIfNotExists() {
    try {
      await fs.access(this.path);
    } catch (error) {
      await fs.writeFile(this.path, "[]"); // En caso que el archivo no exista creo uno con un arreglo vacío
    }
  }

  async addProduct(product) {
    try {
      await this.createFileIfNotExists();
      const validationMessage = await this.validateProduct(product.code);

      if (validationMessage) return validationMessage;

      const products = await this.getProducts();
      product.id = Product.incrementID();
      const productWithId = { id: product.id, ...product };
      products.push(productWithId);

      await fs.writeFile(this.path, JSON.stringify(products), "utf-8");

      return "Product added successfully.";
    } catch (error) {
      console.error(error);
    }
  }

  async validateProduct(code) {
    const products = await this.getProducts();
    const productExist = products.find((prod) => prod.code === code);
    if (productExist) return `The product code "${code}" already exists.`;
  }

  async getProducts() {
    //Retorno todos los productos que leo de forma asincronica desde el path
    try {
      await this.createFileIfNotExists();
      const products = await fs.readFile(this.path, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((prod) => prod.id === parseInt(id));
      return product ? product : "Product not found.";
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(id, updateData) {
    // actualizo un producto segun su ID
    try {
      const products = await this.getProducts();
      const index = products.findIndex((prod) => prod.id === parseInt(id));

      if (index === -1) {
        return "Product not found.";
      }

      const updatedProduct = { ...products[index], ...updateData };
      products[index] = updatedProduct;

      await fs.writeFile(this.path, JSON.stringify(products), "utf-8");

      return "Product updated successfully.";
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter(
        (prod) => prod.id !== parseInt(id)
      );

      if (filteredProducts.length === products.length) {
        return "Product not found";
      }

      await fs.writeFile(this.path, JSON.stringify(filteredProducts), "utf-8");

      return "Product deleted successfully";
    } catch (error) {
      console.error(error);
    }
  }
}

const test = async () => {
  const productManager = new ProductManager("./products.txt");
  const faina = new Product("Faina", "Slice", 150, "", "A123", 20);
  const calabrian = new Product("Calabrian", "Large", 250, "", "F123", 10);
  const special = new Product("Special", "Large", 320, "", "A456", 30);
  const fugazzeta = new Product("Fugazzeta", "Large", 120, "", "T123", 40);
  const margherita = new Product("Margherita", "Large", 1900, "", "L123", 30);
  const neapolitan = new Product("Neapolitan", "Large", 2000, "", "A534", 21);
  const arugula = new Product("Arugula", "Large", 2100, "", "R213", 25);
  const hcEmpanadas = new Product(
    "Ham & cheese empanadas",
    "Dozen",
    2400,
    "",
    "HC123",
    30
  );
  const meatEmpanadas = new Product(
    "Meat empanadas",
    "Dozen",
    2400,
    "",
    "M564",
    20
  );
  const chickenEmpanadas = new Product(
    "Chicken empanadas",
    "Dozen",
    2400,
    "",
    "K123",
    15
  );

  await productManager.addProduct(faina);
  await productManager.addProduct(calabrian);
  await productManager.addProduct(special);
  await productManager.addProduct(fugazzeta);
  await productManager.addProduct(margherita);
  await productManager.addProduct(neapolitan);
  await productManager.addProduct(arugula);
  await productManager.addProduct(hcEmpanadas);
  await productManager.addProduct(meatEmpanadas);
  await productManager.addProduct(chickenEmpanadas);
};
await test();
