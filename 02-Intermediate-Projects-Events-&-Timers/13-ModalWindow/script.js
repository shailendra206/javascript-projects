const productsGrid = document.querySelector('.products-grid')
const modalOverlay = document.querySelector('.modal-overlay')
const closeBtn = document.querySelector('.modal-close')

productsGrid.addEventListener('click',(e)=>{
    const btn = e.target.closest('.quick-view-btn')
    if(!btn) return
    console.log(btn)
    modalOverlay.classList.add('active')
})

closeBtn.addEventListener('click',()=>{
    modalOverlay.classList.remove('active')
})

document.addEventListener('keydown',(e)=>{
    if(e.key === 'Escape'){
        modalOverlay.classList.remove('active')
    }
})