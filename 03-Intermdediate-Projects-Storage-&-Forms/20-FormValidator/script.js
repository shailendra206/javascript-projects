let username = document.getElementById('username')
let email = document.getElementById('email')
let password = document.getElementById('password')
let confirmPassword = document.getElementById('confirmPassword')
let submitBtn = document.querySelector('.btn-submit')

let usernameStr = ''
let emailStr = ''
let passwordStr = ''
let confirmPasswordStr = ''

username.addEventListener('input',()=>{
    usernameStr = username.value
})
email.addEventListener('input',()=>{
    emailStr = email.value
})
password.addEventListener('input',()=>{
    passwordStr = password.value
})
confirmPassword.addEventListener('input',()=>{
    confirmPasswordStr = confirmPassword.value
})

let usernameError = document.getElementById('usernameError')
let emailError = document.getElementById('emailError')
let passwordError = document.getElementById('passwordError')
let confirmPasswordError = document.getElementById('confirmError')

function validateForm(){
    if(usernameStr === ''){
        usernameError.textContent = "Username can't be empty"
        username.classList.add('error')
        username.classList.remove('success')
    }else{
        if(usernameStr.length < 3){
            usernameError.textContent = "Username must be greater than 3"
            username.classList.add('error')
            username.classList.remove('success')
        }
        else{
            usernameError.textContent = ""
            username.classList.add('success')
            username.classList.remove('error')
        }
    }
    
    if(emailStr === ''){
        emailError.textContent = "Email can't be empty"
        email.classList.add('error')
        email.classList.remove('success')
    }else{
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!pattern.test(emailStr)){
            emailError.textContent = "Enter valid mail"
            email.classList.add('error')
            email.classList.remove('success')
        }
        else{
            emailError.textContent = ""
            email.classList.add('success')
            email.classList.remove('error')
        }
    }

    if(passwordStr === ''){
        passwordError.textContent = "Password can't be empty"
        password.classList.add('error')
        password.classList.remove('success')
    }else{
        if(passwordStr.length < 6){
            passwordError.textContent = "Password must be greater than 6 characters"
            password.classList.add('error')
            password.classList.remove('success')
        }
        else{
            passwordError.textContent = ""
            password.classList.add('success')
            password.classList.remove('error')
        }
    }

    if(confirmPasswordStr === ''){
        confirmPasswordError.textContent = "Password can't be empty"
        confirmPassword.classList.add('error')
        confirmPassword.classList.remove('success')
    }else{
        if(confirmPasswordStr !== passwordStr){
            confirmPasswordError.textContent = "Password must be same as confirm password"
            confirmPassword.classList.add('error')
            confirmPassword.classList.remove('success')
        }
        else{
            confirmPasswordError.textContent = ""
            confirmPassword.classList.add('success')
            confirmPassword.classList.remove('error')
        }
    }
}

submitBtn.addEventListener('click',(event)=>{
    event.preventDefault()
    validateForm()
})