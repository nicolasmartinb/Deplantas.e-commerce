const tbody = document.querySelector('.tbody');
const productosContainer = document.getElementById('productos-container');
const botonComprar = document.getElementById("btn-success");
botonComprar.addEventListener ("click", comprarCarrito);
const clickButton= document.querySelector(".ClickButton")

let carrito = [];
// Cargar productos al inicio
window.onload = function () {
  cargarProductos();
};

function cargarProductos() {
  // Utiliza fetch para obtener los productos desde el archivo JSON
  fetch('productos.json')
    .then(response => response.json())
    .then(productos => {
      // Limpiar el contenido existente del contenedor
      productosContainer.innerHTML = '';

      // Genera las tarjetas dinámicamente
      productos.forEach(producto => {
        const card = `
          <div class="col d-flex justify-content-center mb-4">
            <div class="card shadow mb-1 mi-bg rounded" style="width: 20rem;">
              <h5 class="card-title pt-2 text-center txt-cards">${producto.nombre}</h5>
              <img src="${producto.img}" class="card-img-top imagenes" alt="...">
              <div class="card-body">
                <h5 class="text-price">Precio: <span class="precio">${producto.precio}</span></h5>
                <div class="d-grid gap-2">
                  <button class="btn btn-primary button ClickButton" onclick="addToCarritoItem(event)">Añadir a Carrito</button>
                </div>
              </div>
            </div>
          </div>
        `;

        // Agrega la tarjeta al contenedor de productos
        productosContainer.innerHTML += card;
      });
    })
    .catch(error => console.error('Error al cargar los productos:', error));
}



clickButton.forEach(botonComprar => {
botonComprar.addEventListener('click', addToCarritoItem);
});

function addToCarritoItem(e) {
  const button = e.target;
  const item = button.closest('.card');
  const itemTitulo = item.querySelector('.card-title').textContent;
  const itemPrecio = item.querySelector('.precio').textContent;
  const itemImg = item.querySelector('.card-img-top').src;

  const newProduct = {
    title: itemTitulo,
    precio: itemPrecio,
    img: itemImg,
    cantidad: 1
  };

  addItemCarrito(newProduct);
}

function addItemCarrito(newProduct) {
  const alert = document.querySelector('.alert');
  alert.classList.remove('hide');
  
  setTimeout(function () {
    alert.classList.add('hide');
  }, 2000);

  const InputElemento = tbody.getElementsByClassName('inputElemento');
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === newProduct.title.trim()) {
      carrito[i].cantidad++;
      const inputValue = InputElemento[i];
      inputValue.value++;
      CarritoTotal();
      addLocalStorage();
      return null;
    }
  }

  carrito.push(newProduct);
  renderCarrito();
  addLocalStorage();
}

function renderCarrito() {
  tbody.innerHTML = '';
  carrito.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.classList.add('ItemCarrito');
    const content = `
      <th scope="row">${index + 1}</th>
      <td class="table__productos">
        <img src="${item.img}" alt="">
        <h6 class="title">${item.title}</h6>
      </td>
      <td class="table__price"><p>${item.precio}</p></td>
      <td class="table__cantidad">
        <input type="number" min="1" value="${item.cantidad}" class="inputElemento">
        <button class="delete btn btn-danger">x</button>
      </td>
    `;
    tr.innerHTML = content;
    tbody.appendChild(tr);

    tr.querySelector(".delete").addEventListener('click', removeItemCarrito);
    tr.querySelector(".inputElemento").addEventListener('change', sumaCantidad);
  });
  CarritoTotal();
}

function CarritoTotal() {
  let total = 0;
  const itemCartTotal = document.querySelector('.itemCarritoTotal');
  carrito.forEach((item) => {
    const precio = Number(item.precio.replace("€", ''));
    total += precio * item.cantidad;
  });

  itemCartTotal.innerHTML = `Total: €${total}`;
}

function removeItemCarrito(e) {
  const buttonDelete = e.target;
  const tr = buttonDelete.closest(".ItemCarrito");
  const title = tr.querySelector('.title').textContent;
  carrito = carrito.filter(item => item.title.trim() !== title.trim());
  tr.remove();
  CarritoTotal();
  addLocalStorage();
}

function sumaCantidad(e) {
  const sumaInput = e.target;
  const tr = sumaInput.closest(".ItemCarrito");
  const title = tr.querySelector('.title').textContent;
  const selectedItem = carrito.find(item => item.title.trim() === title);
  selectedItem.cantidad = parseInt(sumaInput.value) || 1;
  CarritoTotal();
  addLocalStorage();
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Exelente! Gracias por tu compra',
        showConfirmButton: false,
        timer: 1500
      })
      carrito = [];
      renderCarrito();

    }
    

function addLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

window.onload = function() {
  const storage = JSON.parse(localStorage.getItem('carrito'));
  if (storage) {
    carrito = storage;
    renderCarrito();
  }
};
