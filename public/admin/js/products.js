const urlParams = new URLSearchParams(window.location.search)
const addProductPage = urlParams.get('addProduct')


async function  product_view_and_edit(){
  try {
      const cancel_product_edit = document.getElementById('cancel-product-edit')
      const product_edit_btn = document.getElementById('product-edit-button')
      const view_products_profile = document.getElementById('view-products-profile')
      const display_product_edit = document.getElementById('edit-products-page')
      
      
      
      product_edit_btn.addEventListener('click',()=>{
        console.log("Edit clicked")
        view_products_profile.style.display = 'none'
        display_product_edit.style.display = 'block' 
      })
      cancel_product_edit.addEventListener('click',()=>{
          console.log("Cancel Edit")
          view_products_profile.style.display = 'flex'
        display_product_edit.style.display = 'none'
      })
  } catch (error) {
      // console.log("Product view and edit :"+error)
  }
  
  }
  product_view_and_edit()

  
// ======================================================>
async function product_lits_and_add(){
  try {
      const add_product_btn = document.getElementById('add-product-btn')
  const list_all_products = document.getElementById('view-products-page')
  const add_product_page = document.getElementById('add-products-page')
  const cancel_edit = document.getElementById('cancel-add-btn')
  
  add_product_btn.addEventListener('click',()=>{
  console.log("add product")
  list_all_products.style.display = 'none'
  add_product_btn.style.display = 'none'
  add_product_page.style.display = 'block'
  })
  cancel_edit.addEventListener('click',()=>{
  console.log("Add product cancel")
  list_all_products.style.display = 'block'
  add_product_btn.style.display = 'block'
  add_product_page.style.display = 'none'
  })
  } catch (error) {
    
  }
  
  }
  
  
  product_lits_and_add()
//=========================================================>

async function select_catagorie(){
  try {
  const all = document.getElementById('view-all-products')
  const mens = document.getElementById('view-mens-products')
  const womens = document.getElementById('view-womens-products')
  const kids = document.getElementById('view-kids-products')

  const all_btn = document.getElementById('all-cata-btn')
  const mens_btn = document.getElementById('mens-cata-btn')
  const womens_btn = document.getElementById('womens-cata-btn')
  const kids_btn = document.getElementById('kids-cata-btn')
  const title = document.getElementById('catagorie-title')

  all_btn.addEventListener('click',()=>{
    console.log("all")
    all.style.display = 'block'
    mens.style.display = 'none'
    womens.style.display = 'none'
    kids.style.display = 'none'
    title.innerHTML = "All Products"
  })
  mens_btn.addEventListener('click',()=>{
    console.log("men")
    all.style.display = 'none'
    mens.style.display = 'block'
    womens.style.display = 'none'
    kids.style.display = 'none'
    title.innerHTML = "Mens Products"
  })
  womens_btn.addEventListener('click',()=>{
    console.log("women")
    all.style.display = 'none'
    mens.style.display = 'none'
    womens.style.display = 'block'
    kids.style.display = 'none'
    title.innerHTML = "Womens Products"
  })
  kids_btn.addEventListener('click',()=>{
    console.log("kids")
    all.style.display = 'none'
    mens.style.display = 'none'
    womens.style.display = 'none'
    kids.style.display = 'block'
    title.innerHTML = "Kids Products" 
  })

  } catch (error) {
    
  }
  
 }
 select_catagorie()
//==============================================================>
const uploadImg1 = document.getElementById('upload-img1')
const uploadImg2 = document.getElementById('upload-img2')
const uploadImg3 = document.getElementById('upload-img3')
const uploadImg4 = document.getElementById('upload-img4')

const inputImg1 = document.getElementById('img1')
const inputImg2 = document.getElementById('img2')
const inputImg3 = document.getElementById('img3')
const inputImg4 = document.getElementById('img4')


async function realtimeImageUpdate(){
  try {
    inputImg1.addEventListener('change', (event) => {
    
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadImg1.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

  inputImg2.addEventListener('change', (event) => {
    
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadImg2.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  
  inputImg3.addEventListener('change', (event) => {
    
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadImg3.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  
  inputImg4.addEventListener('change', (event) => {
    
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadImg4.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  } catch (error) {
    
  }
}

realtimeImageUpdate()

  // Selecting Size 

const sizeSpans = document.getElementById("size-s-span");
const sizeSpanm = document.getElementById("size-m-span");
const sizeSpanl = document.getElementById("size-l-span");
const sizeSpanxl = document.getElementById("size-xl-span");
const sizeSpanxxl = document.getElementById("size-xxl-span");
const sizeSpanxxxl = document.getElementById("size-xxxl-span");


   async function select_Size (){
    try {
      sizeSpans.addEventListener("click", function () {
        sizeSpans.classList.toggle("active")
        })
        sizeSpanm.addEventListener("click", function () {
        sizeSpanm.classList.toggle("active")
        })
        sizeSpanl.addEventListener("click", function () {
        sizeSpanl.classList.toggle("active")
        })
        sizeSpanxl.addEventListener("click", function () {
        sizeSpanxl.classList.toggle("active")
        })
        sizeSpanxxl.addEventListener("click", function () {
        sizeSpanxxl.classList.toggle("active")
        })
        sizeSpanxxxl.addEventListener("click", function () {
        sizeSpanxxxl.classList.toggle("active")
        })
    } catch (error) {
      
    }
   }

   select_Size ()
   
   //Discount calculation in add product
   
     function discountCalculation(){
    const price = document.getElementById('proprice').value
    let discount = document.getElementById('discount').value
    const viewDiscount = document.getElementById('discountedPrize')
    const showPrice = document.getElementById('showPrice')
    if(discount > 100) {
      discount = 99
      discount.value = 99
    }
    try {
      const discountedPrice = price - (price * (discount / 100))
      viewDiscount.value = parseInt(discountedPrice)
      showPrice.innerHTML = parseInt(discountedPrice)
    } catch (error) {
      
    }
   }
   
//Discount calculation in edit product
async function discount(){
try {
  const price = document.getElementById('editInputPrice').value
const showPrice = document.getElementById('showPriceEdit')
showPrice.innerHTML = `${price}`
function discountCalculationEdit(){
    const price = document.getElementById('editInputPrice').value
    let discount = document.getElementById('discountEdit').value
    const viewDiscount = document.getElementById('discountedPrizeEdit')
    const showPrice = document.getElementById('showPriceEdit')
    if(discount > 100) {
      discount = 99
      discount.value = 99
    }
    try {
      const discountedPrice = price - (price * (discount / 100))
      viewDiscount.value = parseInt(discountedPrice)
      showPrice.innerHTML = parseInt(discountedPrice)
    } catch (error) {
      
    }
}
} catch (error) {
  
}
}
discount()


  const errMsg = document.getElementById('add-prod-error')
  errMsg.innerHTML = ''
  const submitBtn = document.getElementById('add-new-submitBtn')
  submitBtn.addEventListener('click',(event)=>{
    errMsg.innerHTML = ' '
    const proname = document.getElementById('proname').value
    const probrand = document.getElementById('probrand').value
    const proprice = document.getElementById('proprice').value
    const color = document.getElementById('color').value
    const qty = document.getElementById('qty').value
    const productDecription = document.getElementById('productDecription').value
  const fileInput1 = document.getElementById('img1');
  const fileInput2 = document.getElementById('img2');
  const fileInput3 = document.getElementById('img3');
  const fileInput4 = document.getElementById('img4');

  if(proname.length === 0 ||
    probrand.length === 0 ||
    proprice.length === 0 ||
    color.length === 0 ||
    qty.length === 0 ||
    productDecription.length === 0  ){
      errMsg.innerHTML = 'All fields are required'
      event.preventDefault()
      return
    }
    if(fileInput1.files.length === 0 &&
      fileInput2.files.length === 0 &&
      fileInput3.files.length === 0 &&
      fileInput4.files.length === 0 
      ){
      errMsg.innerHTML = 'No images were Uploaded'
      event.preventDefault()
      return;
    }
    if (fileInput1.files.length === 0) {
      errMsg.innerHTML = 'Image 1 is not Uploaded'
      event.preventDefault()
      return;
      }

     if (fileInput2.files.length === 0) {
      errMsg.innerHTML = 'Image 2 is not Uploaded'
      event.preventDefault()
      return;
     }

     if (fileInput3.files.length === 0) {
      errMsg.innerHTML = 'Image 3 is not Uploaded'
      event.preventDefault()
      return;
     }

      if (fileInput4.files.length === 0) {
        errMsg.innerHTML = 'Image 4 is not Uploaded'
        event.preventDefault()
        return;
  }
     errMsg.innerHTML = ''
  //  event.preventDefault()



  })
  const editBtn = document.getElementById('add-edit-submitBtn')
  editBtn.addEventListener('click',(event)=>{
    errMsg.innerHTML = ' '
    const proname = document.getElementById('proname').value
    const probrand = document.getElementById('probrand').value
    const proprice = document.getElementById('proprice').value
    const color = document.getElementById('color').value
    const qty = document.getElementById('qty').value
    const productDecription = document.getElementById('productDecription').value
  const fileInput1 = document.getElementById('img1');
  const fileInput2 = document.getElementById('img2');
  const fileInput3 = document.getElementById('img3');
  const fileInput4 = document.getElementById('img4');

  if(proname.length === 0 ||
    probrand.length === 0 ||
    proprice.length === 0 ||
    color.length === 0 ||
    qty.length === 0 ||
    productDecription.length === 0  ){
      errMsg.innerHTML = 'All fields are required'
      event.preventDefault()
      return
    }
    errMsg.innerHTML = ''
    // event.preventDefault()

  })