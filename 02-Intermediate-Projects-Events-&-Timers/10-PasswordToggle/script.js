const passwordInput = document.querySelector('.password-input')
const strengthFill = document.querySelector('.strength-fill')
const strengthText = document.querySelector('.strength-text')
const generateBtn = document.querySelector('.btn-generate')
let str = ''
let generatePasswordString
const copyBtn = document.querySelector('.btn-copy')
const eyeIcon = document.querySelector('.eye-icon')
const eyeSlashIcon = document.querySelector('.eye-slash-icon')

eyeIcon.addEventListener('click',()=>{
    eyeIcon.style.display = 'none'
    eyeSlashIcon.style.display = 'block'
    passwordInput.type = 'text'
})

eyeSlashIcon.addEventListener('click',()=>{
    eyeIcon.style.display = 'block'
    eyeSlashIcon.style.display = 'none'
    passwordInput.type = 'password'
})

passwordInput.addEventListener('input',()=>{
    str = passwordInput.value
    passwordStrength()
})

copyBtn.addEventListener('click',()=>{
    navigator.clipboard.writeText(passwordInput.value)
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyBtn.textContent = 'Copy Password';
    }, 2000);
})

generateBtn.addEventListener('click',()=>{
    generatePassword()
})

function passwordStrength(){
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}:;"'<>,.?\/\\|]/.test(str);
    if (/[a-z]/.test(str) || /[A-Z]/.test(str) || /\d/.test(str) || hasSpecialChar){
        strengthFill.classList.add('weak')
        strengthFill.classList.remove('medium')
        strengthFill.classList.remove('strong')
    }
    if (/[a-z]/.test(str) && /[A-Z]/.test(str) || (/\d/.test(str) || hasSpecialChar)){
        strengthFill.classList.add('medium')
        strengthFill.classList.remove('weak')
        strengthFill.classList.remove('strong')
        strengthText.textContent = 'medium'
    }
    if (/[a-z]/.test(str) && /[A-Z]/.test(str) && (/\d/.test(str) 
        || hasSpecialChar) ){
        strengthFill.classList.add('strong')
        strengthFill.classList.remove('weak')
        strengthFill.classList.remove('medium')
        strengthText.textContent = 'strong'
    }
}

function generatePassword(){
    const tempStr = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz[!@#$%^&*()_+\-=\[\]{}:;"<>,.?\/\\|]'
    generatePasswordString = ''
    for(let i = 0; i < 16; i++){
        let random = Math.floor(Math.random()*92)
        generatePasswordString += tempStr[random]
    }
    passwordInput.value = generatePasswordString
    str = generatePasswordString
    passwordStrength()
}
