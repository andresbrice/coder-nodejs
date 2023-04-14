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
      await fs.writeFile(this.path, "[]"); // Escribir un arreglo vacío en el archivo
    }
  }

  async addProduct(product) {
    try {
      await this.createFileIfNotExists();
      const data = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      const productExist = products.some((prod) => prod.code === product.code);

      if (productExist) {
        return `The product code "${product.code}" already exists.`;
      }

      this.products.push(prod); // Agrego el producto al array

      const uniqueProducts = this.products.filter(
        (prod) => !products.some((p) => p.code === prod.code)
      ); // Filtra solo los nuevos productos

      // Actualizo el archivo con los datos del array de ProductManager
      await fs.writeFile(this.path, JSON.stringify(uniqueProducts), "utf-8");

      return product;
    } catch (error) {
      console.error(error);
    }
  }

  async getProducts() {
    //Retorno todos los productos que leo de forma asincronica desde el path
    try {
      await this.createFileIfNotExists();
      const products = await fs.readFile(this.path, "utf-8");
      const prods = JSON.parse(products);
      return prods;
    } catch (error) {
      return error;
    }
  }

  async getProductById(id) {
    //retorno un producto segun su ID
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      const product = products.find((prod) => prod.id === id);
      return product;
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(id, updateData) {
    // actualizo un producto segun su ID
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(data);

      const index = products.findIndex((prod) => prod.id === id);
      if (index === -1) {
        return "Product not found";
      }

      const updatedProduct = { ...products[index], ...updateData };
      products[index] = updatedProduct;

      await fs.writeFile(this.path, JSON.stringify(products), "utf-8");

      return updatedProduct;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProduct(id) {
    //elimino un producto segun su ID
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(data);

      const index = products.findIndex((prod) => prod.id === id);
      if (index === -1) {
        return "Product not found";
      }

      const deletedProduct = products.splice(index, 1)[0];

      await fs.writeFile(this.path, JSON.stringify(products), "utf-8");

      return deletedProduct;
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
test();
