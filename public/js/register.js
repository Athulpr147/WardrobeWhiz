const urlParams = new URLSearchParams(window.location.search)

const e_errMsg = urlParams.get('e_message')
const p_errMsg = urlParams.get('p_message')
const otpSended = urlParams.get('otpSended')
if(otpSended){
    const signup_form = document.getElementById('signup-form')
    const otp_form = document.getElementById('otp-form')
    signup_form.style.display = 'none'
    otp_form.style.display = 'block'
}
if(e_errMsg){
    const message = document.getElementById('reg-email-valid-err')
    message.innerHTML = e_errMsg
}
if(p_errMsg){
    const message = document.getElementById('reg-phone-valid-err')
    message.innerHTML = p_errMsg
}

///Resend otp timer
const targetDate = new Date()
targetDate.setSeconds(targetDate.getSeconds() + 5)
const timerInterval = setInterval(updateTimer, 1000)
function updateTimer(){
  const now = new Date().getTime()
  const timeRemaining = targetDate - now
  if(timeRemaining <= 0){
    clearInterval(timerInterval)
    resendBtn = document.getElementById('resendOTP')
    showTimer = document.getElementById('timer')
    resendBtn.style.display = 'block'
    showTimer.style.display = 'none'
  }else{
    const seconds = Math.floor(timeRemaining/1000)
    document.getElementById('timer').textContent = `Resend otp in 00:${seconds}s`
  }
}
updateTimer()

const otpSubmit = document.getElementById('otpSubmit')
otpSubmit.addEventListener('click',(wait)=>{
    console.log('verify clickedd')
  const otp = document.getElementById('otpInput').value
  console.log(otp)
  const message = document.getElementById('otpErr')
  if(otp.length === 0 || otp === ''){
    message.innerHTML = 'Please enter otp'
    return
  }if(otp.length === 5 || otp.length < 4 || otp.length < 4){
    message.innerHTML = 'Invalid OTP'
    return
  }
  console.log('no validation err')
  console.log('data sended to server')
  fetch('/verify_email',{
    method : 'POST',
    headers : {'Content-Type':'application/json'},
    body : JSON.stringify({ otp })
  }).then((responds)=>responds.json())
  .then((data)=>{
    console.log('Data')
    console.log(data)
    if(data.sucess){
      message.innerHTML = data.message
      window.location.href = data.redirectTo
    }else{
        console.log(message)
      message.innerHTML = data.message
    }
   
  })

  message.innerHTML = ''
  console.log(otp)
//   wait.preventDefault()
})

