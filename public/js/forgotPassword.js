
// (1) ==================================================> Enter mobile or Email
async function enterMobileOrEmail(){
    try {
      const phoneRadio = document.getElementById('phoneRadio')
      const emailRadio = document.getElementById('emailRadio')
      const phoneInput = document.getElementById('phoneInput')
      const emailInput = document.getElementById('emailInput')
      const submit = document.getElementById("enterNumberOTP")

      phoneRadio.addEventListener('change', function() {
        if (phoneRadio.checked) {
          console.log("phone")
          phoneInput.classList.remove('hidden');
          emailInput.classList.add('hidden');
          // submit.addEventListener('click',(event)=>{
          //   emailInput.value.innerHTML = ''
          //   console.log("submit")
          //   if( phoneInput.value.length === 0 ){
          //     console.log("Empty")
          //     event.preventDefault() } 
          //     console.log("not empty")
          // })
        }
      });
  
      emailRadio.addEventListener('change', function() {
        if (emailRadio.checked) {
          console.log("email")
          emailInput.classList.remove('hidden');
          phoneInput.classList.add('hidden');
          // submit.addEventListener('click',(event)=>{
          //   phoneInput.value.innerHTML = ''
          //   if(emailInput.value.length === 0 ){ 
          //     console.log("Empty")
          //     event.preventDefault() }
          // })
        }
        })
      
        // Showing Modal if OTP send Sucessfull
      const enterNumberOTP = document.getElementById('enterNumberOTP')
      const loading = document.getElementById('loading')
      const otpEnterField = document.getElementById('otp-enter-field')
      const OTPsucess = document.getElementById('otp-sucess')
      const otpField = document.getElementById('otp').value
      enterNumberOTP.addEventListener('click',(event)=>{  
          loading.style.display = 'block'
          OTPsucess.innerHTML = "OTP Sending successfull"
          otpEnterField.style.display = 'block'
          
      })
    } catch (error) {
      
    }
  }

  enterMobileOrEmail()
  
// (1) => end----------------------------------------------------------------------------->
const targetDate = new Date()
targetDate.setSeconds(targetDate.getSeconds() + 60)
const timerInterval = setInterval(updateTimer, 1000)
function updateTimer(){
  const now = new Date().getTime()
  const timeRemaining = targetDate - now
  if(timeRemaining <=0){
    clearInterval(timerInterval)
    resendBtn = document.getElementById('resendOTP')
    showTimer = document.getElementById('timer')
    resendBtn.style.display = 'block'
    showTimer.style.display = 'none'
  }else{
    const seconds = Math.floor(timeRemaining/1000)
    document.getElementById('timer').textContent = `Resend otp in 0.${seconds}`
  }
}
updateTimer()

//Otp Validation----------------------------------------------->


const otpSubmit = document.getElementById('otpSubmit')
otpSubmit.addEventListener('click',(wait)=>{
  const otp = document.getElementById('otpInput').value
  const message = document.getElementById('otpErr')
  if(otp.length === 0 || otp === ''){
    message.innerHTML = 'Please enter otp'
    return
  }if(otp.length === 5 || otp.length < 4){
    message.innerHTML = 'Invalid OTP'
    return
  }
  fetch('/enter_otp',{
    method : 'POST',
    headers : {'Content-Type':'application/json'},
    body : JSON.stringify({ otp })
  }).then((responds)=>responds.json())
  .then((data)=>{
    if(data.sucess){
      message.innerHTML = data.message
      window.location.href = data.redirectTo
    }else{
      message.innerHTML = data.message
    }
   
  })


  console.log(otp)
  wait.preventDefault()
})
