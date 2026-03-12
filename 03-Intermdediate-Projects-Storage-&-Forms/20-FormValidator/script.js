const themeToggle = document.getElementById('themeToggle')
const themeIcon = document.getElementById('themeIcon')
const form = document.getElementById('registrationForm')
const usernameInput = document.getElementById('username')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const confirmPasswordInput = document.getElementById('confirmPassword')
const usernameError = document.getElementById('usernameError')
const emailError = document.getElementById('emailError')
const passwordError = document.getElementById('passwordError')
const confirmPasswordError = document.getElementById('confirmPasswordError')
const submitBtn = document.getElementById('submitBtn')
const formCard = document.querySelector('.form-card')
const successMessage = document.getElementById('successMessage')
const resetBtn = document.getElementById('resetBtn')
const passwordToggles = document.querySelectorAll('.password-toggle')

function loadTheme() {
    const savedTheme = localStorage.getItem('validatorTheme')
    if (savedTheme === 'dark') {
        document.body.classList.add('dark')
        themeIcon.textContent = 'light_mode'
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark')
    const isDark = document.body.classList.contains('dark')
    
    if (isDark) {
        themeIcon.textContent = 'light_mode'
        localStorage.setItem('validatorTheme', 'dark')
    } else {
        themeIcon.textContent = 'dark_mode'
        localStorage.setItem('validatorTheme', 'light')
    }
}

function showError(input, errorElement, message) {
    input.classList.add('error')
    input.classList.remove('success')
    errorElement.textContent = message
    errorElement.classList.add('show')
}

function showSuccess(input, errorElement) {
    input.classList.remove('error')
    input.classList.add('success')
    errorElement.textContent = ''
    errorElement.classList.remove('show')
}

function clearValidation(input, errorElement) {
    input.classList.remove('error', 'success')
    errorElement.textContent = ''
    errorElement.classList.remove('show')
}

function validateUsername() {
    const value = usernameInput.value.trim()
    
    if (value === '') {
        showError(usernameInput, usernameError, 'Username is required')
        return false
    }
    
    if (value.length < 3) {
        showError(usernameInput, usernameError, 'Username must be at least 3 characters')
        return false
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        showError(usernameInput, usernameError, 'Username can only contain letters, numbers, and underscores')
        return false
    }
    
    showSuccess(usernameInput, usernameError)
    return true
}

function validateEmail() {
    const value = emailInput.value.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (value === '') {
        showError(emailInput, emailError, 'Email is required')
        return false
    }
    
    if (!emailRegex.test(value)) {
        showError(emailInput, emailError, 'Please enter a valid email address')
        return false
    }
    
    showSuccess(emailInput, emailError)
    return true
}

function validatePassword() {
    const value = passwordInput.value
    
    if (value === '') {
        showError(passwordInput, passwordError, 'Password is required')
        return false
    }
    
    if (value.length < 8) {
        showError(passwordInput, passwordError, 'Password must be at least 8 characters')
        return false
    }
    
    if (!/[A-Z]/.test(value)) {
        showError(passwordInput, passwordError, 'Password must contain at least one uppercase letter')
        return false
    }
    
    if (!/[a-z]/.test(value)) {
        showError(passwordInput, passwordError, 'Password must contain at least one lowercase letter')
        return false
    }
    
    if (!/[0-9]/.test(value)) {
        showError(passwordInput, passwordError, 'Password must contain at least one number')
        return false
    }
    
    showSuccess(passwordInput, passwordError)
    return true
}

function validateConfirmPassword() {
    const value = confirmPasswordInput.value
    const passwordValue = passwordInput.value
    
    if (value === '') {
        showError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password')
        return false
    }
    
    if (value !== passwordValue) {
        showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match')
        return false
    }
    
    showSuccess(confirmPasswordInput, confirmPasswordError)
    return true
}

function validateForm() {
    const isUsernameValid = validateUsername()
    const isEmailValid = validateEmail()
    const isPasswordValid = validatePassword()
    const isConfirmPasswordValid = validateConfirmPassword()
    
    return isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid
}

function resetForm() {
    form.reset()
    
    clearValidation(usernameInput, usernameError)
    clearValidation(emailInput, emailError)
    clearValidation(passwordInput, passwordError)
    clearValidation(confirmPasswordInput, confirmPasswordError)
    
    successMessage.classList.remove('show')
    formCard.style.display = 'block'
}

function togglePasswordVisibility(targetId) {
    const input = document.getElementById(targetId)
    const button = document.querySelector(`[data-target="${targetId}"]`)
    const icon = button.querySelector('.material-symbols-outlined')
    
    if (input.type === 'password') {
        input.type = 'text'
        icon.textContent = 'visibility_off'
    } else {
        input.type = 'password'
        icon.textContent = 'visibility'
    }
}

themeToggle.addEventListener('click', toggleTheme)

usernameInput.addEventListener('blur', validateUsername)
usernameInput.addEventListener('input', () => {
    if (usernameInput.classList.contains('error')) {
        validateUsername()
    }
})

emailInput.addEventListener('blur', validateEmail)
emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('error')) {
        validateEmail()
    }
})

passwordInput.addEventListener('blur', validatePassword)
passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('error')) {
        validatePassword()
    }
    if (confirmPasswordInput.value !== '') {
        validateConfirmPassword()
    }
})

confirmPasswordInput.addEventListener('blur', validateConfirmPassword)
confirmPasswordInput.addEventListener('input', () => {
    if (confirmPasswordInput.classList.contains('error')) {
        validateConfirmPassword()
    }
})

passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault()
        const targetId = toggle.dataset.target
        togglePasswordVisibility(targetId)
    })
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    if (validateForm()) {
        submitBtn.disabled = true
        submitBtn.innerHTML = '<span>Processing...</span>'
        
        setTimeout(() => {
            formCard.style.display = 'none'
            successMessage.classList.add('show')
            submitBtn.disabled = false
            submitBtn.innerHTML = '<span>Create Account</span><span class="material-symbols-outlined btn-icon">arrow_forward</span>'
        }, 1500)
    }
})

resetBtn.addEventListener('click', resetForm)

loadTheme()