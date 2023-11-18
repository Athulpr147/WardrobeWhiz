const urlParams = new URLSearchParams(window.location.search);
 const message = urlParams.get('message');

async function fromServer(){
    if (message) {
        const toastContainer = document.querySelector(".toast-container")
        toastContainer.style.display = 'block'
        toastContainer.innerHTML = message
        setTimeout(()=>{
            toastContainer.style.display = 'none'
        },3000)
    }
}
fromServer()


const applyCoupon = document.getElementById('applyCoupon')
applyCoupon.addEventListener('click', (event) => {
    const couponInput = document.getElementById('coupon-input')
    const couponValue = couponInput.value.trim()

    if (couponValue.length === 0) {
        couponInput.style.outline = '2px solid red'
        couponInput.style.border = '2px solid red'
        couponInput.placeholder = 'Enter a valid coupon'
        couponInput.style.color = 'red';
        event.preventDefault()
    }
})
