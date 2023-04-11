import { Product } from "./Product.js";
class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct(product) {
    const productExist = this.products.some(
      (prod) => prod.code === product.code
    );
    // Consulto que no exista "code" en el array de productos
    if (productExist) {
      return `The product code "${product.code}" already exists.`;
    }
    // Agrego el producto al array de productos
    this.products.push(product);
    return product;
  }

  getProducts() {
    //Retorno todos los productos
    return this.products;
  }

  getProductById(id) {
    // Busco en el array de productos segun el ID y lo retorno en caso que exista. En caso contrario retorno un mensaje por consola indicando que no existe.
    const product = this.products.find((prod) => prod.id === id);
    if (!product) {
      return "Not Found";
    }
    return product;
  }
}

// Se creará una instancia de la clase “ProductManager”
const productManager = new ProductManager();

// Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log("- Displaying the empty product array:");
console.log(productManager.getProducts());

const product1 = new Product("Faina", "Slice", 150, "", "A123", 20);
const product2 = new Product("Calabrian", "Large", 250, "", "F123", 10);
const product3 = new Product("Special", "Large", 320, "", "A456", 30);
const product4 = new Product("Fugazzeta", "Large", 120, "", "T123", 40);
const product5 = new Product();

productManager.addProduct(product1);
productManager.addProduct(product2);
productManager.addProduct(product3);
productManager.addProduct(product4);
productManager.addProduct(product5);

console.log("- List of products after adding them to the products array:");
console.log(productManager.getProducts());
console.log("- Trying to add existing code:");
console.log(productManager.addProduct(product1));
console.log("- Getting the product with id 2:");
console.log(productManager.getProductById(2));
console.log("- Getting a product with nonexistent id:");
console.log(productManager.getProductById(7));
