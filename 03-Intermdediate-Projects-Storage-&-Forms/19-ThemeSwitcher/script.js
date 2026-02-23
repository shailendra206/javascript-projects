const toggle = document.getElementById('themeToggle')
const primaryButton = document.querySelector('.primary')
const secondaryButton = document.querySelector('.secondary')

toggle.addEventListener('change',()=>{
    if(toggle.checked){
        document.body.classList.add('dark')
        localStorage.setItem('theme','dark')
        switchToDark()
    }else{
        document.body.classList.remove('dark')
        localStorage.setItem('theme','light')
        switchToLight()
    }
})

function switchToDark(){
    primaryButton.classList.remove('primary')
    secondaryButton.classList.remove('secondary')
    primaryButton.classList.add('secondary')
    secondaryButton.classList.add('primary')
}

function switchToLight(){
    primaryButton.classList.remove('secondary')
    secondaryButton.classList.remove('primary')
    primaryButton.classList.add('primary')
    secondaryButton.classList.add('secondary')
}

function loadTheme(){
    const savedTheme = localStorage.getItem('theme')
    if(savedTheme === 'dark'){
        toggle.checked = true
        document.body.classList.add("dark");
        switchToDark()
    }else{
        toggle.checked = false
        document.body.classList.remove('dark');
        switchToLight()
    }
}

loadTheme()