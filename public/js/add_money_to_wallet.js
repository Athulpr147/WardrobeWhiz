const add_money_section_btn = document.getElementById('add-money')
const add_money_section = document.getElementById('add-money-section')

const adding_money_field = document.getElementById('addding-the-wallet')
const adding_money_cancel = document.getElementById('adding-money-cancel')

add_money_section_btn.addEventListener('click',()=>{
    add_money_section.style.display = 'none'
    adding_money_field.style.display = 'flex'
})
adding_money_cancel.addEventListener('click',()=>{
    add_money_section.style.display = 'block'
    adding_money_field.style.display = 'none'
})

// const walletAmount = document.getElementById('wallet_amount').value
const submit_amound = document.getElementById('add-money-submit')
console.log(7)
let walletAmount
let sendingAmount
let orderId
submit_amound.addEventListener('click',()=>{
     walletAmount = document.getElementById('wallet_amount').value;
    
    if (walletAmount.trim() === '' || isNaN(walletAmount)) {
        console.log("Invalid wallet amount");
        return; 
    }
     sendingAmount = parseFloat(walletAmount) * 100;
    fetch('/addMoneyViaRazorpay',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({amount : sendingAmount})
    })
    .then((responds)=>responds.json())
    .then((data)=>{
        orderId = data.orderId
//Payment function------------------------------------------------------------>
console.log("sendingAmount >"+sendingAmount)

var options = {
    "key": "rzp_test_BFC8QSPWgscUUW", // Enter the Key ID generated from the Dashboard
    "amount": sendingAmount , // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Athul PR",
    "description": "Test Transaction",
    "image": "https://imgs.search.brave.com/t_FPykuQPQF-SWqBdQl8h24K6kzlVEswAzvSOTRlARo/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS9mdXdwL3V3cDM5/NDQ4NDguanBlZw",
    "order_id": orderId , //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler":  function (response){
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id) ;
        // alert(response.razorpay_signature);
        
        fetch('/addMoneyInWallet',{
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify( 
                { amount : walletAmount ,
                paymentID : response.razorpay_payment_id }   ) 
        })
        .then((response) => response.json())
        .then((data)=>{
            if(data.sucess){
                console.log('Order Completed')
                window.location.href = data.redirectTo 
            }else{
                console.log('sucess false')
            }
        })
        .catch((error)=>{
            console.log("data sending error"+error)
            window.location.href = data.redirectTo
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





//Payment function------------------------------------------------------>
         
         rzp1.open();
    }).catch((err)=>{
        console.log("===============>"+err) 
    })


})

// console.log("sendingAmount >"+sendingAmount)
// var options = {
//     "key": "rzp_test_BFC8QSPWgscUUW", // Enter the Key ID generated from the Dashboard
//     "amount": sendingAmount , // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
//     "currency": "INR",
//     "name": "Athul PR",
//     "description": "Test Transaction",
//     "image": "https://imgs.search.brave.com/t_FPykuQPQF-SWqBdQl8h24K6kzlVEswAzvSOTRlARo/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS9mdXdwL3V3cDM5/NDQ4NDguanBlZw",
//     "order_id": orderId , //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
//     "handler":  function (response){
//         // alert(response.razorpay_payment_id);
//         // alert(response.razorpay_order_id) ;
//         // alert(response.razorpay_signature);
  
//         fetch('/addMoneyInWallet',{
//             method : 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body : JSON.stringify( {paymentID : response.razorpay_payment_id} ,
//                 { amount : walletAmount } ) 
//         })
//         .then((response) => response.json())
//         .then((data)=>{
//             if(data.success){
//                 console.log('Order Completed')
//                 window.location.href = data.redirectTo 
//             }
//         })
//         .catch((error)=>{
//             console.log("data sending error")
//         })
//     },
//     "prefill": {
//         "name": "Athul PR",
//         "email": "athulpr147@gmail.com",
//         "contact": "8330834359"
//     },
//     "notes": {
//         "address": "WardrobeWhiz Corporate Office" 
//     },
//     "theme": {
//         "color": "#ad006e"
//     }
// };
// var rzp1 = new Razorpay(options);
// rzp1.on('payment.failed', function (response){
//         alert(response.error.code);
//         alert(response.error.description);
//         alert(response.error.source);
//         alert(response.error.step);
//         alert(response.error.reason);
//         alert(response.error.metadata.order_id);
//         alert(response.error.metadata.payment_id);
        
// });