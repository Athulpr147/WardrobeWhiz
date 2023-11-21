
const urlParams = new URLSearchParams(window.location.search)
let sortValue = urlParams.get('sort')
let cata = urlParams.get('catagorie')
window.onload = function() {
    filter(cata,sortValue)
}


const itemsPerPage = 8
let currentPage = 1
const productCard = document.getElementById('productCard-explore')
const paginationContainer = document.getElementById('pagination-container')

const womens = document.getElementById('womens')
const mens = document.getElementById('mens')
const kids = document.getElementById('kids')
const all = document.getElementById('all')
async function home_select(){
    try{
        womens.addEventListener('click',()=>{
            cata = 'womens'
            filter('womens',sortValue)
            
        })
        mens.addEventListener('click',()=>{
            cata = 'mens'
            filter('mens',sortValue)
            
        })
        kids.addEventListener('click',()=>{
            cata = 'kids'
            filter('kids',sortValue)
            
    })
        all.addEventListener('click',()=>{
            cata = 'all'
            filter('all',sortValue)
            
        })
    }catch(err){
        consolr.log(err)
    }
}
home_select()
// Get references to the span elements
const popularityButton = document.getElementById('sort-popularity');
const lowHighButton = document.getElementById('sort-low-high');
const highLowButton = document.getElementById('sort-high-low');
const newFirstButton = document.getElementById('sort-new-first');

newFirstButton.classList.add('active-sort');
async function filerSort(){
    
    try {
        // Add click event listeners to each span element
popularityButton.addEventListener('click', function () {
    popularityButton.classList.add('active-sort');
    lowHighButton.classList.remove('active-sort');
    highLowButton.classList.remove('active-sort');
    newFirstButton.classList.remove('active-sort');
    filter(cata,'popularity')
    sortValue = 'popularity'
    history.pushState(null, '', `/getProducts?catagorie=${cata}&sort=${sortValue}`);
    // handleSortClick('popularity');
});

lowHighButton.addEventListener('click', function () {
    popularityButton.classList.remove('active-sort');
    lowHighButton.classList.add('active-sort');
    highLowButton.classList.remove('active-sort');
    newFirstButton.classList.remove('active-sort');
    sortValue = 'priceLowToHigh'
    filter(cata,'priceLowToHigh')
    history.pushState(null, '', `/getProducts?catagorie=${cata}&sort=${sortValue}`);
    // handleSortClick('priceLowToHigh');
});

highLowButton.addEventListener('click', function () {
    popularityButton.classList.remove('active-sort');
    lowHighButton.classList.remove('active-sort');
    highLowButton.classList.add('active-sort');
    newFirstButton.classList.remove('active-sort');
    // handleSortClick('priceHighToLow');
    sortValue = 'priceHighToLow'
    filter(cata,'priceHighToLow')
    history.pushState(null, '', `/getProducts?catagorie=${cata}&sort=${sortValue}`);
});

newFirstButton.addEventListener('click', function () {
    popularityButton.classList.remove('active-sort');
    lowHighButton.classList.remove('active-sort');
    highLowButton.classList.remove('active-sort');
    newFirstButton.classList.add('active-sort');
    // handleSortClick('newFirst');
    sortValue = 'newFirst'
    filter(cata,'newFirst')
    history.pushState(null, '', `/getProducts?catagorie=${cata}&sort=${sortValue}`);
});
    } catch (error) {
        // console.log(error)
    }
}

// Get references to the radio button elements
//Select collection radio
const allCollectionRadio = document.getElementById('all-collection');
const mensCollectionRadio = document.getElementById('mens-collection');
const womensCollectionRadio = document.getElementById('womens-collection');
const kidsCollectionRadio = document.getElementById('kids-collection');

async function filterByCata(){
    try{
        // Add a change event listener to each radio button
 allCollectionRadio.addEventListener  ('change',  function () {
    history.pushState(null, '', `/getProducts?catagorie=all&sort=${sortValue}`);
    filter('all',sortValue)
    cata = 'all'
})

mensCollectionRadio.addEventListener('change', function () {
    history.pushState(null, '', `/getProducts?catagorie=mens&sort=${sortValue}`) 
    cata = 'mens'
    filter('mens',sortValue)
});

womensCollectionRadio.addEventListener('change', function () {
    history.pushState(null, '', `/getProducts?catagorie=womens&sort=${sortValue}`);
    cata = 'womens'
    filter('womens',sortValue)
});

kidsCollectionRadio.addEventListener('change', function () {
    history.pushState(null, '', `/getProducts?catagorie=kids&sort=${sortValue}`); 
    cata = 'kids'
    filter('kids',sortValue)
});

    }catch(err){
        console.log(err)
    }
}
filterByCata()
filerSort()

// Fetch data from database 



let products = []
const loader = document.getElementById('loader')

async function filter(cata, sort , page = 1) {
    try {

        productCard.innerHTML = ''
        loader.style.display = 'flex' 
        const data = { cata: cata, sort: sort , page: page }  

        const response = await fetch('/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ payload: data })       
        })

        if (!response.ok) {
            // Check if the response is not okay 
            loader.style.display = 'flex' 
            productCard.innerHTML = ''
            throw new Error(`Fetch error - Status: ${response.status}`);
        }
        loader.style.display = 'none' 
        const result = await response.json();
        console.log('Data received');
         products = result.payload.products
        /////////////////////  console.log(products)
        if(products.length < 1 || products == [] ) {

        }
        productCard.innerHTML = ''
        products.forEach(element => {
            const products = `
            <div class="col-12 explore-card-main">
    <div class="card-discount"><span>${element.discount}% Off</span></div>
   <a href="/product/${element._id}">
    <div class="explore-img bg-primary">
        <img src="/uploads/${element.image[0]}" alt="">
    </div>
   
    <div class="col-12">
       <div class="row">
        <div class="col-12 mt-1 explore-card-brand">${element.brand}</div>
        <div class="col-12 mt-1 explore-card-proName">${element.name}</div>
        <div class="col-12 mt-1"> <span class="card-offer-price">₹<span class="card-offer-price">${element.discountPrice}</span>.00</span> <span class="ms-1 card-cut-price">₹<span class="card-cut-price">${element.price}</span>.00</span></div>
       </div>
    </div>
</a>
</div>
            
            `
            productCard.innerHTML += products
        })
        updatePaginationBtn(result.payload.totalPage, result.payload.currentPage)
    } catch (error) {
        console.error('Fetch error:= = = = = = = = = > ', error)
    }
}
function updatePaginationBtn(totalPages, currentPage) {
    paginationContainer.innerHTML = ''

    // Previous Button
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerHTML = 'Previous';
        prevButton.addEventListener('click', () => {
            filter(cata, sortValue, currentPage - 1)
        })
        paginationContainer.appendChild(prevButton);
    }

    // Page Buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerHTML = i;

    // Check if the button is for the current page
        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        pageButton.addEventListener('click', () => {
            filter(cata, sortValue, i);
        });
        paginationContainer.appendChild(pageButton);
    }

    // Next Button
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerHTML = 'Next';
        nextButton.addEventListener('click', () => {
            filter(cata, sortValue, currentPage + 1);
        });
        paginationContainer.appendChild(nextButton);
    }
}


// setInterval(filter(cata, sort , page = 1), 5000);

// function updatePagination(){
//     const totalPage = Math.ceil(products.length / itemsPerPage)
//     pagination.innerHTML = ''
//     for (let i = 1 ; i <= totalPage ; i++ ){
//     const pageButton = document.createElement('button')
//     pageButton.innerHTML = i
//     pageButton.addEventListener('click',()=>{
//         currentPage = i
//         displayProducts()
//     })
//     pagination.appendChild(pageButton)
//     }
// }
// function displayProducts(){
//     const startIndex = (currentPage-1 * itemsPerPage)
//     const endIndex = startIndex + itemsPerPage
//     const itemsToDisplay = products.slice(startIndex,endIndex)

//     productCard.innerHTML = ''
// }