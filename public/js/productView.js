const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');

async function fromServer(){
    if (message) {
      console.log("ndo")
        const toastContainer = document.querySelector(".toast-container")
        toastContainer.style.display = 'block'
        toastContainer.innerHTML = message
        setTimeout(()=>{
            toastContainer.style.display = 'none'
        },3000)
    }
}
fromServer()

//Product image view gallery---------------------------------------
function showThisImage(index){
    console.log(index)
  const imgUrl = document.getElementById(`${index}`).src
  document.getElementById('main-img').src = imgUrl
}

//Select quantity
const remove = document.getElementById('button-addon1')
const add = document.getElementById('button-addon2')
let showQty = document.getElementById('qty-show')
let send_qty = document.getElementById('quantity')
const wist_qty = document.getElementById('wish-quantity')
function addOne() {
  add.addEventListener('click', () => {
    
    if (showQty.value < 10) { 
      showQty.value = parseInt(showQty.value) + 1;
      send_qty.value = showQty.value
      wist_qty.value = showQty.value
    }
  });
}

function removeOne() {
  remove.addEventListener('click', () => {
    
    if (showQty.value > 1) {
      showQty.value = parseInt(showQty.value) - 1;
      send_qty.value = showQty.value
      wist_qty.value = showQty.value
    }
  });
}

addOne();
removeOne();

// ?=========>
//Sending size to Cart and wishlist
function sendSize(){
  const size = document.getElementById('select-size')
  const form_size = document.getElementById('size')
  const wish_size = document.getElementById('wish-size')
  const selectedSize = size.options[size.selectedIndex].text
  form_size.value = selectedSize
  wish_size.value = selectedSize
  
}
