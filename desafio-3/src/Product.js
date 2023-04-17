export class Product {
  static idIncrement = 0;

  constructor(
    title = "",
    description = "",
    price = 0,
    thumbnail = "",
    code = "",
    stock = 0
  ) {
    this.id = Product.incrementID();
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }

  static incrementID() {
    try {
      Product.idIncrement =
        Product.idIncrement < 1 ? 1 : Product.idIncrement + 1;
      return Product.idIncrement;
    } catch (error) {
      return console.log(error);
    }
  }
}
