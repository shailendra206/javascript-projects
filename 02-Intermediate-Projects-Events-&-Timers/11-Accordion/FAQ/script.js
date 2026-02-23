const accordion = document.querySelector('.accordion')

accordion.addEventListener('click',(item)=>{
    const btn = item.target.closest('.icon')
    const allHeader = document.querySelectorAll('.accordion-item')
    if(!btn) return
    
    allHeader.forEach((item)=>{
        item.classList.remove('active')
        const minusIcon = item.querySelector('.icon-minus')
        const plusIcon = item.querySelector('.icon-plus')
        minusIcon.classList.add('hidden')
        plusIcon.classList.remove('hidden')
    })

    const header = btn.closest('.accordion-item')
    header.classList.add('active')
    
    const minusIcon = btn.querySelector('.icon-minus')
    const plusIcon = btn.querySelector('.icon-plus')
    minusIcon.classList.remove('hidden')
    plusIcon.classList.add('hidden')
})