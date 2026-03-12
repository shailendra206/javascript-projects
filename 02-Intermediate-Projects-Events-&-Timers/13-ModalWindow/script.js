const aboutBtn = document.getElementById('aboutBtn')
const overlay = document.getElementById('overlay')
const cardClose = document.getElementById('cardClose')
const themeToggle = document.getElementById('themeToggle')

aboutBtn.addEventListener('click', () => {
    overlay.classList.add('open')
})
cardClose.addEventListener('click', () => {
    overlay.classList.remove('open')
})

themeToggle.addEventListener('click', () => {
    if(document.documentElement.dataset.theme === 'dark'){
        document.documentElement.dataset.theme = 'light'
    }else{
        document.documentElement.dataset.theme = 'dark'
    }
})