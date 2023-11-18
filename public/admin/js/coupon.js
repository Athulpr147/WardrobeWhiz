console.log("1")
 // Extract the 'message' query parameter from the URL
 const urlParams = new URLSearchParams(window.location.search);
 const message = urlParams.get('message');
console.log(message.length > 1)
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



const currentDate = new Date().toISOString().split('T')[0];

        document.getElementById('expireDate').min = currentDate;

// -------------------------
//  const codeInput = document.getElementById('coupon-input').value
//  const codeErr = document.getElementById('coupon-err')
//  const discountInput = document.getElementById('dis-input').value
//  const discountErr = document.getElementById('discount-err')
 
//  console.log("3")

//  async function preventSubmit(){
//     const subBtn = document.getElementById('sub-btn')
//     try{
//         subBtn.addEventListener('click',(event)=>{
//             console.log("click")
//             let code = codeinput()
//             let discount = discountinput ()
//             if(!code  || !discount ){
//                 event.preventDefault()
//             }
//         })
//     }catch(err)
//     {
//         console.log(err)
//     }
//  }
//  preventSubmit()

//  function codeinput(){
//     if(codeInput.length === 0 || codeInput === " " ){
//         codeErr.innerHTML = "This cant be empty"
//         return false
//     }
//     codeErr.innerHTML = " "
//         return true
    
//  }
//   function discountinput (){
//     if(discountInput.length === 0 || discountInput === " " ){
//         codeErr.innerHTML = "This cant be empty"
//         return false
//     }if(discountInput.length < 1) {
//         discountErr.innerHTML = "Must be greater than 1"
//         return false
//     }
//     if(discountInput.length > 99){
//         discountErr.innerHTML = "Must be lessthan 99"
//         return false
//     }
//     discountErr.innerHTML = " "
//     return true
//  }

 