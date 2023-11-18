
//Confirm form submission 
if(window.history.replaceState){
    window.history.replaceState(null,null,window.location.href)
}
//----------------------------------------------------->
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    if (form) {
      form.querySelector('button[type="submit"]').disabled = true;
    }
  })