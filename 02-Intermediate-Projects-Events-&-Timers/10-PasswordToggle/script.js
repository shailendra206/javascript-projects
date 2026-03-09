let togglePassword = document.getElementById('togglePassword')
let inputField = document.getElementById('password')

togglePassword.addEventListener('click', () => {
    if(inputField.type == 'password'){
        togglePassword.textContent = 'hide'
        inputField.type = 'text'
    }else{
        togglePassword.textContent = 'show'
        inputField.type = 'password'
    }
})