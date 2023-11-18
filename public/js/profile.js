const urlParams = new URLSearchParams(window.location.search); 
const address = urlParams.get('address');
const dashboard = urlParams.get('dashboard')
const order  = urlParams.get('order')
const wishlist  = urlParams.get('wishlist')

const addressBtn = document.getElementById('address-link')
const dashboardBtn = document.getElementById('dashboard-link')
const orderBtn = document.getElementById('order-link')
const wishlistBtn = document.getElementById('wishlist-link')

const dashboardPage = document.getElementById('profile-dashboard')
const orderPage = document.getElementById('profile-orders')
const addressPage = document.getElementById('profile-adderss')
const wishlistPage = document.querySelector('.profile-wishlist')

dashboardBtn.addEventListener('click',()=>{
    history.pushState(null, "", "?dashboard=true")
    dashboardPage.style.display = 'block'
    orderPage.style.display = 'none'
    addressPage.style.display = 'none'
    wishlistPage.style.display = 'none'
})

orderBtn.addEventListener('click',()=>{
    history.pushState(null, "", "?order=true")
    dashboardPage.style.display = 'none'
    orderPage.style.display = 'block'
    addressPage.style.display = 'none'
    wishlistPage.style.display = 'none'

})

wishlistBtn.addEventListener('click',()=>{
    console.log(true)
    history.pushState(null,"","?wishlist=true")
    dashboardPage.style.display = 'none'
    orderPage.style.display = 'none'
    addressPage.style.display = 'none'
    wishlistPage.style.display = 'block'

})

addressBtn.addEventListener('click',()=>{
    history.pushState(null, "", "?address=true")
    dashboardPage.style.display = 'none'
    orderPage.style.display = 'none'
    addressPage.style.display = 'block'
    wishlistPage.style.display = 'none'

})


if(address)addressBtn.click()
    
if(wishlist) wishlistBtn.click()

if(dashboard)dashboardBtn.click()

if(order)orderBtn.click()
   

// Profile DAshboard

const nameEditIcon = document.getElementById('name-edit-icon')
const emailEditIcon = document.getElementById('email-edit-icon')
const phoneEditIcon = document.getElementById('phone-edit-icon')

const nameEditBtn = document.getElementById('name-edit-btn')
const emailEditBtn = document.getElementById('email-edit-btn')
const phoneEditBtn = document.getElementById('phone-edit-btn')

const nameEditCancelBtn = document.getElementById('name-edit-cancel-btn')
const emailEditCancelBtn = document.getElementById('email-edit-cancel-btn')
const phoneEditCancelBtn = document.getElementById('phone-edit-cancel-btn')

const nameInput = document.getElementById('name-input')
const emailInput = document.getElementById('email-input')
const phoneInput = document.getElementById('phone-input')
const msg = document.getElementById('err-msg')
async function editProfile(){
    try {
        //Name field
nameEditIcon.addEventListener('click',()=>{
    nameInput.disabled = false
    nameInput.style.color = 'black'
    nameInput.style.fontWeight = 'bold'
    nameEditIcon.style.display = 'none'
    nameEditBtn.style.display = 'block'
    nameEditCancelBtn.style.display = 'block'
    
})
nameEditCancelBtn.addEventListener('click',()=>{
    nameInput.disabled = true
    nameInput.style.color = 'grey'
    nameInput.style.fontWeight = 'normal'
    nameEditIcon.style.display = 'block'
    nameEditBtn.style.display = 'none'
    nameEditCancelBtn.style.display = 'none'
    msg.innerHTML = ''
})
//Email field
emailEditIcon.addEventListener('click',()=>{
    emailInput.disabled = false
    emailInput.style.color = 'black'
    emailInput.style.fontWeight = 'bold'
    emailEditIcon.style.display = 'none'
    emailEditBtn.style.display = 'block'
    emailEditCancelBtn.style.display = 'block'

})
emailEditCancelBtn.addEventListener('click',()=>{
    emailInput.disabled = true
    emailInput.style.color = 'grey'
    emailInput.style.fontWeight = 'normal'
    emailEditIcon.style.display = 'block'
    emailEditBtn.style.display = 'none'
    emailEditCancelBtn.style.display = 'none'
    msg.innerHTML = ''
})

//Phone Fields
phoneEditIcon.addEventListener('click',()=>{
    phoneInput.disabled = false
    phoneInput.style.color = 'black'
    phoneInput.style.fontWeight = 'bold'
    phoneEditIcon.style.display = 'none'
    phoneEditBtn.style.display = 'block'
    phoneEditCancelBtn.style.display = 'block'

})
phoneEditCancelBtn.addEventListener('click',()=>{
    phoneInput.disabled = true
    phoneInput.style.color = 'grey'
    phoneInput.style.fontWeight = 'normal'
    phoneEditIcon.style.display = 'block'
    phoneEditBtn.style.display = 'none'
    phoneEditCancelBtn.style.display = 'none'
    msg.innerHTML = ''
})
    } catch (error) {
        
    }
}
editProfile()
// Addresss ========>
const addAdderssBtn = document.getElementById('add-address-btn')
const addAdressForm = document.getElementById('addAdressForm') 
const showAddress = document.getElementById('showAddress')
const cancelAdd = document.getElementById('cancelAdd')
const addressEdit = document.getElementById('addressEdit')
const cancelEdit = document.getElementById('cancelEdit')
const editBtn = document.querySelector('.editBtn')
const deleteAdd = document.getElementById('deleteAdd')

async function addressPages(){
    try {
        addAdderssBtn.addEventListener('click',()=>{
            addAdressForm.style.display = 'block'
            addAdderssBtn.style.display = 'none'
            showAddress.style.display = 'none'
        })
        cancelAdd.addEventListener('click',()=>{
            addAdressForm.style.display = 'none'
            addAdderssBtn.style.display = 'block'
            showAddress.style.display = 'block'
        })
        
        editBtn.addEventListener('click',()=>{
            deleteAdd.style.display = 'none'
            addressEdit.style.display = 'block'
            editBtn.style.display = 'none'
        
        })
        cancelEdit.addEventListener('click',()=>{
            addressEdit.style.display = 'none'
            deleteAdd.style.display = 'block'
            editBtn.style.display = 'block'
        })
    } catch (error) {
        
    }
}

addressPages()

//----------Edit Validation---------->

nameEditBtn.addEventListener('click',(e)=>{
    const input = document.getElementById('name-input').value
    const msg = document.getElementById('err-msg')
    if(input.length === 0){
        e.preventDefault()
        msg.innerHTML = 'Name cannot be empty'
        return
    }
    msg.innerHTML = ''
})
emailEditBtn.addEventListener('click',(e)=>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    const input = document.getElementById('email-input').value
    const msg = document.getElementById('err-msg')
    if(input.length === 0){
        e.preventDefault()
        msg.innerHTML = 'Email cannot be empty'
        return
    }if(!emailRegex.test(input)){
        e.preventDefault()
        msg.innerHTML = 'invalid Email format'
        return
    }
    msg.innerHTML = ''
})
phoneEditBtn.addEventListener('click',(e)=>{
    const input = document.getElementById('phone-input').value
    const msg = document.getElementById('err-msg')
    if(input.length === 0){
        e.preventDefault()
        msg.innerHTML = 'Phone cannot be empty'
        return
    }
    if(input.length < 10 || input.length > 10){
        e.preventDefault()
        msg.innerHTML = 'Phone must be 10 digits'
        return
    }
    if(isNaN(input)){
        e.preventDefault()
        msg.innerHTML = 'Phone number must be number'
        return 
    }
    msg.innerHTML = ''
})
//Add wallet money validation
const wallet_add_btn = document.getElementById('add-money-submit')
wallet_add_btn.addEventListener('click',(e)=>{
    const msg = document.getElementById('add_money_err')
    const input = document.getElementById('wallet_amount').value
   
    if(input.length < 100){
        e.preventDefault()
        msg.innerHTML = 'Minimum amount is 100'
        return
    }
    if(input.length > 10000){
        e.preventDefault()
        msg.innerHTML = 'Minimum amount is 10000'
        return
    }
    msg.innerHTML = ''
})
const cancelAddWallet = document.getElementById('adding-money-cancel')
cancelAddWallet.addEventListener('click',()=>{
    const msg = document.getElementById('add_money_err')
    msg.innerHTML = 'Min-₹100'
})
