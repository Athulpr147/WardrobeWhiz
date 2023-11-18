

const address_submit = document.getElementById('address_submit')
const address_err_msg = document.getElementById('profile_address_message')

address_submit.addEventListener('click',(event)=>{
    const address_name = document.getElementById('address-name').value.trim();
    const address_phone = document.getElementById('address-phone').value.trim();
    const address_pincode = document.getElementById('address-pincode').value.trim();
    const address_city = document.getElementById('address-city').value.trim();
    const address_address = document.getElementById('address-address').value.trim();
    const address_state = document.getElementById('address-state').value.trim();
    const address_country = document.getElementById('address-country').value.trim();

    if(address_name.length <= 0 || address_phone.length <= 0 || address_pincode.length <= 0 || address_city.length <= 0 || address_address.length <= 0 || address_state.length <= 0 || address_country.length <= 0 ){
        address_err_msg.innerHTML = 'Enter all fields'
        console.log(address_name)
        event.preventDefault()  
        return
    }
    if(address_phone.length > 10 || address_phone.length <10){
        address_err_msg.innerHTML = 'Phone NUmber must have 10 digit'
        event.preventDefault()
        return
    }
    address_err_msg.innerHTML = ' '

})
