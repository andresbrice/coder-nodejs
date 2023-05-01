const socket = io();
const productListContainer = document.getElementById("product-list");
const addProductButton = document.getElementById("addProductButton");

const deleteButtonHandler = () => {
  const deleteProductButtons = document.querySelectorAll(
    ".deleteProductButton"
  );
  deleteProductButtons.forEach((button) => {
    button.onclick = () => {
      const id = button.dataset.productId;
      socket.emit("deleteProduct", id);
    };
  });
};

deleteButtonHandler();

if (addProductButton) {
  addProductButton.onclick = () => {
    Swal.fire({
      title: "Add product",
      html: `
      <form class="form-container" id="addProductForm">
        <div>
          <label for="title">Title:</label>
          <input id="title" class="swal2-input" required>
        </div>
        <div>
          <label for="description">Description:</label>
          <input id="description" class="swal2-input" required>
        </div>
        <div>
          <label for="price">Price:</label>
          <input id="price" class="swal2-input" type="text" required>
        </div>
        <div>
          <label for="code">Code:</label>
          <input id="code" class="swal2-input" required>
        </div>
        <div>
          <label for="stock">Stock:</label>
          <input id="stock" class="swal2-input" type="text" required>
        </div>
        <div>
          <label for="category">Category:</label>
          <input id="category" class="swal2-input" required>
        </div>
      </form>
      `,

      showCancelButton: true,
      confirmButtonText: "Add",
      confirmButtonColor: "#1abc9c",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      preConfirm: () => {
        const form = document.getElementById("addProductForm");
        const title = form.elements["title"].value;
        const description = form.elements["description"].value;
        const price = form.elements["price"].value;
        const code = form.elements["code"].value;
        const stock = form.elements["stock"].value;
        const category = form.elements["category"].value;

        if (!title || !description || !price || !code || !stock || !category) {
          Swal.showValidationMessage("Please fill all fields");
          return false;
        }

        if (!/^\d+$/.test(price) || !/^\d+$/.test(stock)) {
          Swal.showValidationMessage(
            "Price and stock must be positive numbers"
          );
          return false;
        }

        const product = {
          title,
          description,
          price: Number(price),
          code,
          stock: Number(stock),
          category,
        };

        return product;
      },
      customClass: {
        input: "swal2-input-custom",
        validationMessage: "swal2-validation-message",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const product = result.value;

        socket.emit("addProduct", product, (response) => {
          if (typeof response === "string") {
            // En caso que el codigo ya exista en la BD muestro mensaje de error
            Swal.fire({
              title: "Error",
              text: response,
              icon: "error",
              confirmButtonColor: "#1abc9c",
            });
          } else {
            // En caso que se agregue correctamente el producto muestro mensaje de éxito
            Swal.fire({
              title: "Product added",
              text: "The product has been added successfully",
              icon: "success",
              confirmButtonColor: "#1abc9c",
            });
          }
        });
      }
    });
  };
}

socket.on("updateProductList", (products) => {
  productListContainer.innerHTML = "";
  products.forEach((product) => {
    productListContainer.innerHTML += `
      <div class="product-card">
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <p>Code: ${product.code}</p>
        <p>Price: ${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Category: ${product.category}</p>
        <div class="buttonContainer">
          <button
            type="submit"
            class="deleteProductButton"
            data-product-id="${product.id}"
          >Delete</button>
        </div>
      </div>
      `;
  });
  deleteButtonHandler();
});
