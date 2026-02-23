const navMenu = document.querySelector('.nav-menu')
const hamburger = document.querySelector('.hamburger')
const allNavItems = document.querySelectorAll('.nav-link')

navMenu.addEventListener('click',(e)=>{
    const navItem = e.target.closest('.nav-link')
    if(!navItem) return 
    allNavItems.forEach((item)=>{
        item.classList.remove('active')
    })
    navItem.classList.add('active')
    navMenu.classList.remove('active')
    hamburger.classList.remove('active')
})

hamburger.addEventListener('click',()=>{
    if(hamburger.classList.contains('active')){
        hamburger.classList.remove('active')
        navMenu.classList.remove('active')
    }else{
        hamburger.classList.add('active')
        navMenu.classList.add('active')
    }
})

document.addEventListener('click',(e)=>{
    const navbar = document.querySelector('.navbar')
    const isClickInside = navbar.contains(e.target)

    if(!isClickInside && navMenu.classList.contains('active')){
        navMenu.classList.remove('active')
        hamburger.classList.remove('active');
    }
})