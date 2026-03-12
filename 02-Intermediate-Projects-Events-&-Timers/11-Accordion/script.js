const wholeList = document.querySelector('.faq-list')
const allBody = document.querySelectorAll('.faq-body')
const allIcons = document.querySelectorAll('.material-symbols-outlined')
allBody.forEach(
    item => {
        item.style.display = 'none'
    }
)

wholeList.addEventListener('click', (e) => {
    const btn = e.target.closest('.material-symbols-outlined')
    if(!btn) return

    const isOpen = btn.textContent === 'close'
    allBody.forEach(item => {
        item.style.display = 'none'
    })
    allIcons.forEach(item => {
        item.textContent = 'add'
    })
    if(!isOpen) {
        btn.textContent = 'close'
        const item = btn.closest('.faq-item')
        const itemBody = item.querySelector('.faq-body')
        itemBody.style.display = 'block'
    }
})