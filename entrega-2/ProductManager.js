import { Product } from "./Product.js";
import { promises as fs } from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  async createFileIfNotExists() {
    try {
      await fs.access(this.path);
    } catch (error) {
      await fs.writeFile(this.path, JSON.stringify(this.products));
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

      this.products.push(product); // Añadir el nuevo producto al array this.products

      // Guardar la nueva versión del array products que incluye el nuevo producto
      await fs.writeFile(
        this.path,
        JSON.stringify([...products, product]),
        "utf-8"
      );

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
    try {
      const data = await fs.readFile(this.path, "utf8");
      const products = JSON.parse(data);
      const product = products.find((prod) => prod.id === id);
      return product || "Not Found";
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(id, updateData) {
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

async function test() {
  // Se creará una instancia de la clase “ProductManager”
  const productManager = new ProductManager("./products.txt");

  // Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
  console.log("- Displaying the empty product array:");
  console.log(await productManager.getProducts());

  // Se llamará al método “addProduct” con los campos:
  // title: “producto prueba”
  // description:”Este es un producto prueba”
  // price:200,
  // thumbnail:”Sin imagen”
  // code:”abc123”,
  // stock:25
  // El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
  const product1 = new Product("Faina", "Slice", 150, "", "A123", 20);
  const product2 = new Product("Calabrian", "Large", 250, "", "F123", 10);
  const product3 = new Product("Special", "Large", 320, "", "A456", 30);
  const product4 = new Product("Fugazzeta", "Large", 120, "", "T123", 40);
  await productManager.addProduct(product1);
  await productManager.addProduct(product2);
  await productManager.addProduct(product3);
  await productManager.addProduct(product4);

  // Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
  console.log("- Displaying the product array with the newly added product:");
  console.log(await productManager.getProducts());

  // Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado,
  // en caso de no existir, debe arrojar un error.
  console.log("- Getting the product with id 1:");
  console.log(await productManager.getProductById(1));

  console.log("- Getting a product with nonexistent id:");
  console.log(await productManager.getProductById(7));

  // Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto,
  // se evaluará que no se elimine el id y que sí se haya hecho la actualización.
  console.log("- Updating product with id 1:");
  const updateData = {
    title: "Producto de prueba actualizado",
    description: "Este es un producto prueba actualizado",
    price: 300,
    thumbnail: "",
    code: "nuevoCodigo123",
    stock: 20,
  };
  console.log(await productManager.updateProduct(1, updateData));

  // Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
  console.log("- Deleting product with id 1:");
  console.log(await productManager.deleteProduct(1));

  console.log("- Displaying the product array after deleting the product:");
  console.log(await productManager.getProducts());

  // Agregar un producto con un código que ya existe
  const product5 = new Product(
    "Nuevo producto",
    "Descripción del nuevo producto",
    200,
    "imagen.png",
    "F123",
    50
  );
  const result = await productManager.addProduct(product5);
  console.log("- Trying to add a product with an existing code:");
  console.log(result);
}

test();
