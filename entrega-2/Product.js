export class Product {
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
    if (this.idIncrement) {
      //Existe esta propiedad
      this.idIncrement++;
    } else {
      this.idIncrement = 1;
    }
    return this.idIncrement;
  }
}
