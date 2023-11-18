const login_submit = document.getElementById('login_submit')
const registeration_submit = document.getElementById('registeration_submit')

//Register submit button validation

registeration_submit.addEventListener('click',(event)=>{
    const isName = reg_name_error_msg()
    const isEmail = reg_email_error_msg()
    const isPhone = reg_phone_error_msg()
    const isPassword = reg_password_error_msg()
    if(!isName && !isEmail && !isPhone && !isPassword){
        event.preventDefault()
    }
})

//Login Submit button

login_submit.addEventListener('click',(event)=>{
    const isEmail = login_email_validation ()
    const isPassword = login_password_validation()
    if(!isEmail && !isPassword){
        event.preventDefault()
    }
})



//Login
function login_email_validation (){
    const login_email = document.getElementById('login_email').value
    const message = document.getElementById('login-email-error-msg')
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    
    if(login_email.length === 0 || login_email === " "){
        message.innerHTML = "Cannot be empty"
        console.log("Cannot be empty")
        return false
    }
    if(!emailRegex.test(login_email)){
        message.innerHTML = "Invalid email format"
        console.log( "Invalid email format")
        return false
    }
     message.innerHTML = " "
     return true
}
function login_password_validation(){
    const login_password = document.getElementById('login_password').value
    const message = document.getElementById('login-password-error-msg')
    if(login_password.length === 0 || login_password === " "){
        message.innerHTML = "Cannot be empty"
        return false
    }
    if(login_password.length <= 3){
        message.innerHTML = "Must be greater than 3"
        return false
    }
    if(login_password.length >=15){
        message.innerHTML = "Maxinum is 15 character"
        return false
    }
      message.innerHTML = " "
      return true
}

//Registration
function reg_name_error_msg(){
 const registeration_name = document.getElementById('registeration_name').value
   const message = document.getElementById('reg-name-valid-err')
   if(registeration_name.length ===0 || registeration_name === " "){
    message.innerHTML = "This field is required"
    return false
   }
   message.innerHTML = " "
   return true
}
function reg_email_error_msg(){
    const registeration_email = document.getElementById('registeration_email').value
    const message = document.getElementById('reg-email-valid-err')
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    if(registeration_email.length === 0 || registeration_email === ' '){
        message.innerHTML = "This field is required"
        return false
    }
    if(!emailRegex.test(registeration_email)){
        message.innerHTML = "Invalid Email id"
        return false
    }
    message.innerHTML = " "
    return true  
}
function reg_phone_error_msg(){
    const registeration_phone = document.getElementById('registeration_phone').value
    const message = document.getElementById('reg-phone-valid-err')
    if(registeration_phone.length === 0 || registeration_phone === ' '){
        message.innerHTML = "This field is required"
        return false
    }
    if(registeration_phone.length <10 || registeration_phone.length >10){
        message.innerHTML = "Must be 10 digits" 
        return false
    }
    if(isNaN(registeration_phone)){
     message.innerHTML = "Must be number" 
     return false
    }
    message.innerHTML = " "
    return false

}
function reg_password_error_msg(){
    const registeration_password = document.getElementById('registeration_password').value
    const message = document.getElementById('reg-password-valid-err')
    if(registeration_password.length === 0 || registeration_password === " "){
        message.innerHTML = "This cant be empty"
        return false
    }
    if(registeration_password.length <= 3){
        message.innerHTML = "Mininum 4 character required"
        return false
    }
    if(registeration_password.length >= 15){
        message.innerHTML = "Maximun 15 character"
        return false
    }
    
    message.innerHTML = " "
    return true
}

