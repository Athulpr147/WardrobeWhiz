function change_password_(){
    const input = document.getElementById('change_password').value
    const message = document.getElementById('change_password_error')
    if(input.length === 0 || input === " "){
      message.innerHTML = "This Cant be empty....."
      return false
    }
    if(input.length <= 3){
      message.innerHTML = 'Minimum 3 characher rquired....'
      return false
    }
    if(input.length >=15){
      message.innerHTML = "Maximium 15 chatacters......"
      return false
    }
    message.innerHTML = ' '
    return true
  }
  function re_enter_password_(){
    const input = document.getElementById('change_password').value
    const input2 = document.getElementById('re_enter_password').value
    const message = document.getElementById('re_enter_password_error')
    if(input2.length === 0 || input2 === " "){
      message.innerHTML = "This Cant be empty......."
      return false
    }
    if(input2.length <= 3){
      message.innerHTML = 'Minimum 3 characher rquired......'
      return false
    }
    if(input2.length >=15){
      message.innerHTML = "Maximium 15 chatacters...."
      return false
    }
    function isPasswordSame(){
    const input = document.getElementById('change_password').value
    const input2 = document.getElementById('re_enter_password').value
    const message = document.getElementById('re_enter_password_error')
      if(input !== input2){
        console.log("Not equal")
        message.innerHTML = "Password must be equal"
        return flase
      }

    }
    isPasswordSame()

    message.innerHTML = " "
    
  } 