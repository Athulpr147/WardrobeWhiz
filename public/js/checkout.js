window.addEventListener('load', function() {
    // This function will run when the page has finished loading.
    var loaderWrapper = document.querySelector('.loader');
    loaderWrapper.style.display = 'none';
})

const cancelAddAddressBtn = document.getElementById('cancelAdd')
const addAdressBtn = document.getElementById('addAdressBtn')

const addAdress = document.getElementById('addAdress')
const selectAddress = document.getElementById('selectAddress')

addAdressBtn.addEventListener('click',()=>{
    addAdress.style.display = 'block'
    selectAddress.style.display = 'none'
})
cancelAddAddressBtn.addEventListener('click',()=>{
    addAdress.style.display = 'none'
    selectAddress.style.display = 'flex'
})

const showAddress = document.getElementById('showAddress')
const selecting_list = document.getElementById('selecting-list')
const sltBtn = document.getElementById('select-bttn')

sltBtn.addEventListener('click',()=>{
    showAddress.style.display = 'none'
    selecting_list.style.display = 'block'
})



//Payment btn

const C_O_D = document.getElementById('C_O_D')
const C_O_D_btn = document.getElementById('C_O_D_btn')

const razorPay = document.getElementById('razorPay')
const razorPay_Btn = document.querySelector('.razorPay_Btn')

const wallet = document.getElementById('wallet')
const wallet_btn = document.getElementById('wallet_btn')
 
async function pay_btn(){
    try{
        C_O_D.addEventListener('click',()=>{
            C_O_D_btn.style.display = 'block'
            razorPay_Btn.style.display = 'none'
            wallet_btn.style.display = 'none'
            console.log("cl")
        
        })
        
        razorPay.addEventListener('click',()=>{
            C_O_D_btn.style.display = 'none'
            razorPay_Btn.style.display = 'block'
            wallet_btn.style.display = 'none'
            console.log("cl")
        
        })
        
        wallet.addEventListener('click',()=>{
            C_O_D_btn.style.display = 'none'
            razorPay_Btn.style.display = 'none'
            wallet_btn.style.display = 'block'
            console.log("cl")
        
        })
    }catch(err){
        console.error(err)
    }
}
pay_btn()








let finalPriceValue = document.getElementById('finalPriceValue').textContent;
let orderAddress = document.getElementById('orderAddress').textContent;
// var loaderWrapper = document.querySelector('.loader');
// loaderWrapper.style.display = 'none';
   

// Razor pay=======================================>
let orderId
fetch('/checkoutViaRazorpay',{
    method : 'POST',
    headers : {
        'Content-Type' : 'application/json'
    },
    body : JSON.stringify({amount : finalPriceValue})
})
.then((responds)=>responds.json())
.then((data)=>{
     orderId = data.orderId
}).catch((err)=>{
    console.log(err) 
})

  


let amount = finalPriceValue * 100
console.log(amount)
var options = {
    "key": "rzp_test_BFC8QSPWgscUUW", // Enter the Key ID generated from the Dashboard
    "amount": amount , // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Athul PR",
    "description": "Test Transaction",
    "image": "https://imgs.search.brave.com/t_FPykuQPQF-SWqBdQl8h24K6kzlVEswAzvSOTRlARo/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS9mdXdwL3V3cDM5/NDQ4NDguanBlZw",
    "order_id": orderId , //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler":  function (response){
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id) ;
        // alert(response.razorpay_signature);
  
        fetch('/addOrder',{
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify( {paymentID : response.razorpay_payment_id ,
                 orderAddress : orderAddress,
                 paymentMethod : 'Razorpay',
                 paymentStatus : 'Paid'}) 
        })
        .then((response) => response.json())
        .then((data)=>{
            if(data.success){
                console.log('Order Completed')
                window.location.href = data.redirectTo
            }
        })
        .catch((error)=>{
            console.log("data sending error")
        })
    },
    "prefill": {
        "name": "Athul PR",
        "email": "athulpr147@gmail.com",
        "contact": "8330834359"
    },
    "notes": {
        "address": "WardrobeWhiz Corporate Office" 
    },
    "theme": {
        "color": "#ad006e"
    }
};
var rzp1 = new Razorpay(options);
rzp1.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
        
});
document.getElementById('rzp-button1').onclick = function(e){
    rzp1.open();
    e.preventDefault();
    // loaderWrapper.style.display = 'block';
}

//Cash on delivery =================================================>

C_O_D_btn.addEventListener('click',()=>{
    const randomNumber = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
    fetch('/addOrder',{
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body : JSON.stringify( {paymentID : 'COD_'+randomNumber ,
            orderAddress : orderAddress,
            paymentMethod : 'Casn on delivery',
            paymentStatus : 'Un-Paid'}) 
        })
        .then((responds)=> responds.json())
        .then((data)=>{
            if(data.success){
                console.log('Order completed')
                window.location.href = data.redirectTo
            }
        })
    })

//Wallet Payment =================================================>

wallet_btn.addEventListener('click',()=>{
    const randomNumber = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
    fetch('/debitWallet',{
        method : 'POST',
        headers : {'Content-Type':'application/json'},
        body : JSON.stringify({ amount : finalPriceValue})
    })
    .then((responds)=> responds.json())
    .then((data)=>{
        if(data.sucess){
            fetch('/addOrder',{
                method : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body : JSON.stringify( {paymentID : 'WLT_'+randomNumber ,
                    orderAddress : orderAddress,
                    paymentMethod : 'Wallet',
                    paymentStatus : 'Paid' }) 
                })
                .then((responds)=> responds.json())
                .then((data)=>{
                if(data.success){
                console.log('Order completed')
                window.location.href = data.redirectTo
            }
        })
        }
    })
})