let passwordInput = document.getElementById('passwordInput')

let passwordStr = ""

passwordInput.addEventListener('input',()=>{
    passwordStr = passwordInput.value
    passwordValid()
})
let reqLength = document.getElementById('reqLength')
let reqUpper = document.getElementById('reqUpper')
let reqNumber = document.getElementById('reqNumber')
let reqSpecial = document.getElementById('reqSpecial')

let bar = document.querySelector('.bar-fill')

function passwordValid(){
    if(passwordStr.length > 6){
        const icon = reqLength.querySelector('.icon')
        icon.textContent = '✔️'
        reqLength.classList.add('valid')
        bar.classList.add('weak')
    }
    if(/[A-Z]/.test(passwordStr)){
        const icon = reqUpper.querySelector('.icon')
        icon.textContent = '✔️'
        reqUpper.classList.add('valid')
        bar.classList.add('weak')
    }
    if(/\d/.test(passwordStr)){
        const icon = reqNumber.querySelector('.icon')
        icon.textContent = '✔️'
        reqNumber.classList.add('valid')
        bar.classList.add('medium')
    }
    if(/[!@#$%]/.test(passwordStr)){
        const icon = reqSpecial.querySelector('.icon')
        icon.textContent = '✔️'
        reqSpecial.classList.add('valid')
        bar.classList.add('strong')
    }
}


const toggleBtn = document.getElementById('toggleBtn')

toggleBtn.addEventListener('click',()=>{
    if(passwordInput.type === 'password'){
        passwordInput.type = 'text'
        toggleBtn.textContent = '🙈'
    }else{
        passwordInput.type = 'password'
        toggleBtn.textContent = '👁️'
    }
})