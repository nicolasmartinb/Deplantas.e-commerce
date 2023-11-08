const Clickbutton = document.querySelectorAll('.button');
const tbody = document.querySelector('.tbody');
const botonComprar = document.querySelector("#btn-success");

let carrito = [];

Clickbutton.forEach(btn => {
  btn.addEventListener('click', addToCarritoItem);
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
