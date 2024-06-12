const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = window.document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = []

// ABRIR O MODAL
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
});

// FECHAR O MODAL AO CLICAR FORA OU NO BOTÃO DE FECHAR
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal || event.target === closeModalBtn) {
    cartModal.style.display = "none";
  }
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price)
  }
});

function addToCart(name, price){
  let quantity = 1
  const existingItem = cart.find(item => item.name === name)

  if(existingItem){
   existingItem.quantity += 1 
   existingItem.price = (existingItem.quantity * price)
  }else {
    cart.push({
      name,
      price,
      quantity,

    })    
  }
  
  updateCartModal();
  
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartElementItem = document.createElement("div");
    cartElementItem.classList.add("flex", "justify-between", "flex-col-1", "mb-4")

    cartElementItem.innerHTML = `
    <div class="flex w-full justify-between items-center">
      <div>
        <p class="font-medium">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-bold mt-2">R$ ${item.price.toFixed(2)}</p>
      </div>

      <button class="rounded-lg shadow-lg remove-from-cart-btn" data-name="${item.name}">
        Remover
      </button>
      
      
    </div>
    `

    total += item.price

    cartItemsContainer.appendChild(cartElementItem)

  })

  cartTotal.innerText = `Total: R$ ${total.toFixed(2)}`;
  cartCounter.innerText = cart.length;
}

cartItemsContainer.addEventListener('click', function(event){
  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")
    
    
    removeItemCart(name);
  }
})

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name)

  if(index !== -1){
    const item = cart[index]

    if(item.quantity > 1){
      item.quantity -= 1
      updateCartModal();
      return
    }
  }

  cart.splice(index, 1)
  updateCartModal();

}

addressInput.addEventListener("input", function(event){
  let inputValue = event.target.value;

  if(inputValue !== 0){
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden")
  }
})

// FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function(){

// LÓGICA PARA NAO RECEBER PEDIDOS DE COMPRA COM A LOJA FECHADA.

 /*
  const isOpen = checkoutRestaurantOpen();
  if(!isOpen){
      
    Toastify({
        text: "Ops, a loja está fechada!",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "rgb(107 33 168)",
        }
      }).showToast();


    return;
  } 
  */  

  if(cart.length === 0) return;
  if(addressInput.value === ""){

    Toastify({
      text: "Ops, digite um endereço!",
      duration: 3000,
      destination: "",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "left", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "rgb(107 33 168)",
      }
    }).showToast();

//    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }


  // ENVIAR PEDIDO VIA WHATSAPP API
  const cartItems = cart.map((item) => {
    return (
      `Nome do Produto: ${item.name} Quantidade: ${item.quantity} Preço: R$${item.price} | `
    )
  }).join("")

  const message = encodeURIComponent(cartItems);
  const phone = "5581993259534"

  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")


  cart = [];
  Toastify({
    text: "Pedido Realizado!",
    duration: 4000,
    destination: "",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "rgb(107 33 168)",
    }
  }).showToast();
  updateCartModal();

})


// VERIFICAR HORARIO E MANIPULAR O CARD HORARIO (CASO QUEIRA FECHAR A LOJA EM HORARIOS NAO COMERCIAIS)
 
/* 
function checkoutRestaurantOpen(){
  const data = new Date();
  const hora = data.getHours();
  return hora >= 8 && hora < 18; 
}

const spanItem = document.getElementById("date-span")
const isOpen = checkoutRestaurantOpen();

if(isOpen){
  spanItem.classList.remove("bg-red-500")
  spanItem.classList.add("bg-purple-600")
}else{
  spanItem.classList.remove("bg-purple-600")
  spanItem.classList.add("bg-red-500")
}
*/
