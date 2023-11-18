
async function edit_users_event(){
  try {
    const editBtn =  document.getElementById('editBtn')
    const cancelEditBtn = document.getElementById('cancelEditBtn')
editBtn.addEventListener('click',()=>{
    console.log("click edit")
    const viewEditPage = document.getElementById('viewEditPage')
    const viewPageProfile = document.getElementById('viewPageProfile')
    setTimeout(()=>{
        viewPageProfile.style.display = 'none';
        viewEditPage.style.display = 'block'; 
    })
})

cancelEditBtn.addEventListener('click',()=>{
  viewPageProfile.style.display = 'block';
        viewEditPage.style.display = 'none';
})




  } catch (error) {
    // console.log(error)
  }
}

 edit_users_event()


//  //---------------------------------------------------------------> 


//  async function  product_view_and_edit(){
//   try {
//       const cancel_product_edit = document.getElementById('cancel-product-edit')
//       const product_edit_btn = document.getElementById('product-edit-button')
//       const view_products_profile = document.getElementById('view-products-profile')
//       const display_product_edit = document.getElementById('edit-products-page')
      
      
      
//       product_edit_btn.addEventListener('click',()=>{
//         console.log("Edit clicked")
//         view_products_profile.style.display = 'none'
//         display_product_edit.style.display = 'block' 
//       })
//       cancel_product_edit.addEventListener('click',()=>{
//           console.log("Cancel Edit")
//           view_products_profile.style.display = 'flex'
//         display_product_edit.style.display = 'none'
//       })
//   } catch (error) {
//       // console.log("Product view and edit :"+error)
//   }
  
//   }
//   product_view_and_edit()
  
//  //---------------------------------------------------------------> 
  
//   async function product_lits_and_add(){
//   try {
//       const add_product_btn = document.getElementById('add-product-btn')
//   const list_all_products = document.getElementById('view-products-page')
//   const add_product_page = document.getElementById('add-products-page')
//   const cancel_edit = document.getElementById('cancel-add-btn')
  
//   add_product_btn.addEventListener('click',()=>{
//   console.log("add product")
//   list_all_products.style.display = 'none'
//   add_product_btn.style.display = 'none'
//   add_product_page.style.display = 'block'
//   })
//   cancel_edit.addEventListener('click',()=>{
//   console.log("Add product cancel")
//   list_all_products.style.display = 'block'
//   add_product_btn.style.display = 'block'
//   add_product_page.style.display = 'none'
//   })
//   } catch (error) {
    
//   }
  
//   }
  
  
//   product_lits_and_add()
  
//  //----Select product catagorie-----------------------------------------------------> 
 
//  async function select_catagorie(){
//   try {
//   const all = document.getElementById('view-all-products')
//   const mens = document.getElementById('view-mens-products')
//   const womens = document.getElementById('view-womens-products')
//   const kids = document.getElementById('view-kids-products')

//   const all_btn = document.getElementById('all-cata-btn')
//   const mens_btn = document.getElementById('mens-cata-btn')
//   const womens_btn = document.getElementById('womens-cata-btn')
//   const kids_btn = document.getElementById('kids-cata-btn')
//   const title = document.getElementById('catagorie-title')

//   all_btn.addEventListener('click',()=>{
//     console.log("all")
//     all.style.display = 'block'
//     mens.style.display = 'none'
//     womens.style.display = 'none'
//     kids.style.display = 'none'
//     title.innerHTML = "All Products"
//   })
//   mens_btn.addEventListener('click',()=>{
//     console.log("men")
//     all.style.display = 'none'
//     mens.style.display = 'block'
//     womens.style.display = 'none'
//     kids.style.display = 'none'
//     title.innerHTML = "Mens Products"
//   })
//   womens_btn.addEventListener('click',()=>{
//     console.log("women")
//     all.style.display = 'none'
//     mens.style.display = 'none'
//     womens.style.display = 'block'
//     kids.style.display = 'none'
//     title.innerHTML = "Womens Products"
//   })
//   kids_btn.addEventListener('click',()=>{
//     console.log("kids")
//     all.style.display = 'none'
//     mens.style.display = 'none'
//     womens.style.display = 'none'
//     kids.style.display = 'block'
//     title.innerHTML = "Kids Products" 
//   })

//   } catch (error) {
    
//   }
  
//  }
//  select_catagorie()



 //-----Logiin  validation----------------------------------------------------------> 
 
 function login_email() {
  const login_email = document.getElementById('email-login').value;
  const message = document.getElementById('emailError');
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (login_email.length === 0 || login_email.trim() === "") {
    message.innerHTML = "Cannot be empty";
    console.log("Cannot be empty");
    return false;
  }

  if (!emailRegex.test(login_email)) {
    message.innerHTML = "Invalid email format";
    console.log("Invalid email format");
    return false;
  }

  message.innerHTML = " ";
  return true;
}

function login_password() {
  const login_password = document.getElementById('password-login').value;
  const message = document.getElementById('passwordError');

  if (login_password.length === 0 || login_password.trim() === "") {
    message.innerHTML = "Cannot be empty";
    return false;
  }

  if (login_password.length <= 3) {
    message.innerHTML = "Must be greater than 3";
    return false;
  }

  if (login_password.length >= 15) {
    message.innerHTML = "Maximum is 15 characters";
    return false;
  }

  message.innerHTML = " ";
  return true;
}

async function login_submit(){
  const login_submit = document.getElementById('submit-login');

  try {
    login_submit.addEventListener('click', (event) => {
      const isEmailValid = login_email();
      const isPasswordValid = login_password();
    
      console.log("Clicked");
      console.log(isEmailValid);
      console.log(isPasswordValid);
    
      if (!isEmailValid || !isPasswordValid) {
        event.preventDefault();
        console.log("Not valid");
      } else {
        console.log("Valid");
      }
    });
  } catch (error) {
    
  }
}
login_submit()





 //--Add product validation----------------------------------------> 



// document.addEventListener("DOMContentLoaded", async function () {
//   // const productForm = document.getElementById('productForm');
//   const submitBtn = document.getElementById('submitBtn');

//    submitBtn.addEventListener(  'click', function (event) {
   
//     const nameInput = document.getElementById('proname');
//     const brandInput = document.getElementById('probrand');
//     const priceInput = document.getElementById('proprice');
//     const cataInput = document.getElementById('productCatagorie');
//     const colorInput = document.getElementById('color');
//     const qtyInput = document.getElementById('qty');
//     const subCatInput = document.getElementById('productSubCatagorie');
//     const descrInput = document.getElementById('productDecription');
//     const sizeS = document.getElementById('size-s');
//     const sizeM = document.getElementById('size-m');
//     const sizeL = document.getElementById('size-l');
//     const sizeXL = document.getElementById('size-xl');
//     const sizeXXL = document.getElementById('size-xxl');
//     const sizeXXXL = document.getElementById('size-xxxl');
//     const img1Input = document.getElementById('img1');
//     const img2Input = document.getElementById('img2');
//     const img3Input = document.getElementById('img3');
//     const img4Input = document.getElementById('img4');
    
//     const errName = document.getElementById('errName');
//     const errBrand = document.getElementById('errBrand');
//     const errPrice = document.getElementById('errPrice');
//     const errCata = document.getElementById('errCata');
//     const errColor = document.getElementById('errColor');
//     const errQty = document.getElementById('errQty');
//     const errSubCat = document.getElementById('errSubCat');
//     const errDescr = document.getElementById('errDescr');
    

//     let isValid = true;

//     if (nameInput.value.trim() === '') {
//       errName.textContent = 'Name is required';
//       isValid = false;
//     } else {
//       errName.textContent = '';
//     }

//     if (brandInput.value.trim() === '') {
//       errBrand.textContent = 'Brand is required';
//       isValid = false;
//     } else {
//       errBrand.textContent = '';
//     }

//     if (priceInput.value.trim() === '') {
//       errPrice.textContent = 'Price is required';
//       isValid = false;
//     } else {
//       errPrice.textContent = '';
//     }

//     if (cataInput.value === 'Default') {
//       errCata.textContent = 'Category is required';
//       isValid = false;
//     } else {
//       errCata.textContent = '';
//     }

//     if (colorInput.value.trim() === '') {
//       errColor.textContent = 'Color is required';
//       isValid = false;
//     } else {
//       errColor.textContent = '';
//     }

//     if (qtyInput.value.trim() === '') {
//       errQty.textContent = 'Quantity is required';
//       isValid = false;
//     } else {
//       errQty.textContent = '';
//     }

//     if (subCatInput.value === 'Default') {
//       errSubCat.textContent = 'Sub category is required';
//       isValid = false;
//     } else {
//       errSubCat.textContent = '';
//     }

//     if (descrInput.value.trim() === '') {
//       errDescr.textContent = 'Description is required';
//       isValid = false;
//     } else {
//       errDescr.textContent = '';
//     }

    

//     if (!isValid) {
//       event.preventDefault();
//     }
//   });
// })

 //---------------------------------------------------------------> 





 //---------------------------------------------------------------> 






 //---------------------------------------------------------------> 








 //---------------------------------------------------------------> 







// const uploadImg1 = document.getElementById('upload-img1')
// // const uploadImg2 = document.getElementById('upload-img2')
// // const uploadImg3 = document.getElementById('upload-img3')
// // const uploadImg4 = document.getElementById('upload-img4')

// const inputImg1 = document.getElementById('img1')
// // const inputImg2 = document.getElementById('img2')
// // const inputImg3 = document.getElementById('img3')
// // const inputImg4 = document.getElementById('img4')


//  inputImg1.addEventListener('change', (event) => {
    
//       const file = event.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           uploadImg1.src = e.target.result;
//         };
//         reader.readAsDataURL(file);
//       }
//     });
   
