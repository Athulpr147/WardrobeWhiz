const newCataBtn = document.getElementById('newCataBtn')
const cancel_add_cata = document.getElementById('cataInputCancel')

newCataBtn.addEventListener('click',()=>{
    
    const newCataBtn = document.getElementById('newCataBtn')
    const newCata_input = document.querySelector('.newCata_input')
    const newCataButtons = document.querySelector('.newCataButtons')
   newCataBtn.style.display = 'none'
   newCata_input.style.display = 'block'
   newCataButtons.style.display = 'block'  
})

async function cancelCata(){
    try {
        cancel_add_cata.addEventListener('click',()=>{
            const newCataBtn = document.getElementById('newCataBtn')
            const newCata_input = document.querySelector('.newCata_input')
            const newCataButtons = document.querySelector('.newCataButtons')
            newCataBtn.style.display = 'block'
           newCata_input.style.display = 'none' 
           newCataButtons.style.display = 'none' 
        })
    } catch (error) {
        
    }
}
cancelCata()


