const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");
const navs = document.querySelectorAll('.bottom-nav-item')
const allNavsBottom = document.querySelector('.mobile-bottom-nav')
const allNavsUpper = document.querySelector('.nav-links')
window.addEventListener('scroll', () => {
    updateActiveSection()
})
allNavsBottom.addEventListener('click', (e) => {
    let item = e.target.closest('.bottom-nav-item')
    goToSection(item.dataset.target)
})
allNavsUpper.addEventListener('click', (e) => {
    let item = e.target.closest('.nav-link')
    goToSection(item.dataset.target)
})

function updateActiveSection(){
    let currentSection = 'home'
    sections.forEach(item => {
        const position = item.getBoundingClientRect()
        if(position.top <= (window.innerHeight/2)){
            currentSection = item.id
        }
    })
    navLinks.forEach(item => {
        if(item.dataset.target === currentSection){
            item.classList.add('active')
        }else{
            item.classList.remove('active')
        }
    })
    navs.forEach(item => {
        if(item.dataset.target === currentSection){
            item.classList.add('active')
        }else{
            item.classList.remove('active')
        }
    })
}

function goToSection(item){
    let element = document.getElementById(item)
    if(element)
        element.scrollIntoView({behavior:"smooth"})
}

updateActiveSection()