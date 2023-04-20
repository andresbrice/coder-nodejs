class Cart {
  constructor() {
    this.id = Cart.incrementID();
    this.productId = productId;
    this.quantity = quantity;
  }
  static incrementID() {
    if (!this.idIncrement) {
      return (this.idIncrement = 1);
    }

    return this.idIncrement++;
  }
}
