export class Product {
  constructor(
    title = "",
    description = "",
    price = 0,
    thumbnail = "",
    code = "",
    stock = 0
  ) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = Product.incrementID();
  }

  static incrementID() {
    if (!this.idIncrement) {
      // Si el contador de ID no existe, se establece en 1
      this.idIncrement = 1;
    }
    // Se incrementa el contador de ID y se devuelve el valor actualizado
    return this.idIncrement++;
  }
}
