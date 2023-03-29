import { Product } from "./Product.js";
class ProductManager {
  static lastId = 0;
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    // Consulto que esten todos los campos requeridos
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("All fields are required.");
      return;
    }

    // Consulto que no exista "code" en el array de productos
    if (this.products.some((product) => product.code === code)) {
      console.log("The product code already exists.");
      return;
    }

    const product = new Product(
      ++ProductManager.lastId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );

    // Agrego el producto al array de productos
    this.products.push(product);
    return product;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    // Busco en el array de productos segun el ID y lo retorno en caso que exista. En caso contrario retorno un mensaje por consola indicando que no existe.
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      console.log("Not Found");
      return;
    }
    return product;
  }
}

// Se creará una instancia de la clase “ProductManager”
const productManager = new ProductManager();

// Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log("- An empty array should be displayed:");
console.log(productManager.getProducts());

// Se llamará al método “addProduct” con los campos: {title: “producto prueba”,description:”Este es un producto prueba”, price:200, thumbnail:”Sin imagen”,code:”abc123”,stock:25} El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
const product1 = productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

// Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
console.log("- The added product should be displayed:");
console.log(productManager.getProducts());

// Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
console.log(
  "- An error message will be displayed because the code already exists:"
);

const product2 = productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

// Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
console.log(
  "- An error message will be displayed because the ID doesn't exists:"
);
const getProduct1 = productManager.getProductById(3);

// Se evaluara que getProductById devuelva un ID existente
console.log("- The product found will be displayed according to its id:");
const getProduct2 = productManager.getProductById(1);
console.log(getProduct2);

// Se evaluara que funcione el ID autoincremental al agregar otro producto y se llamará el método “getProducts” nuevamente, esta vez deben aparecer los dos productos agregados
const product3 = productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "def567",
  25
);

console.log("- The added product should be displayed:");
console.log(productManager.getProducts());

// Se evaluara que no se pueda agregar un producto con campos faltantes
console.log(
  "- An error message will be displayed because the field title is missing:"
);
const product4 = productManager.addProduct(
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "def567",
  25
);
