const themeToggle = document.getElementById('themeToggle')
const themeIcon = document.getElementById('themeIcon')
const passwordInput = document.getElementById('passwordInput')
const visibilityToggle = document.getElementById('visibilityToggle')
const visibilityIcon = document.getElementById('visibilityIcon')
const strengthText = document.getElementById('strengthText')
const strengthPercentage = document.getElementById('strengthPercentage')
const progressFill = document.getElementById('progressFill')
const verifyBtn = document.getElementById('verifyBtn')

const criteriaLength = document.getElementById('criteriaLength')
const criteriaSymbols = document.getElementById('criteriaSymbols')
const criteriaMixed = document.getElementById('criteriaMixed')
const criteriaNumbers = document.getElementById('criteriaNumbers')
const criteriaLong = document.getElementById('criteriaLong')
const criteriaNoCommon = document.getElementById('criteriaNoCommon')

const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    'dragon', 'master', 'login', 'princess', 'sunshine'
]

function loadTheme() {
    const savedTheme = localStorage.getItem('passwordValidatorTheme')
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
        localStorage.setItem('passwordValidatorTheme', 'dark')
    } else {
        themeIcon.textContent = 'dark_mode'
        localStorage.setItem('passwordValidatorTheme', 'light')
    }
}

function togglePasswordVisibility() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'
        visibilityIcon.textContent = 'visibility_off'
    } else {
        passwordInput.type = 'password'
        visibilityIcon.textContent = 'visibility'
    }
}

function updateCriteria(element, passed) {
    const icon = element.querySelector('.criteria-icon')
    if (passed) {
        icon.textContent = 'check_circle'
        icon.classList.add('passed')
    } else {
        icon.textContent = 'circle'
        icon.classList.remove('passed')
    }
}

function checkPasswordStrength(password) {
    let score = 0
    let checks = {
        length: false,
        symbols: false,
        mixed: false,
        numbers: false,
        long: false,
        noCommon: false
    }
    
    if (password.length >= 8) {
        checks.length = true
        score += 15
    }
    
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        checks.symbols = true
        score += 20
    }
    
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        checks.mixed = true
        score += 20
    }
    
    if (/[0-9]/.test(password)) {
        checks.numbers = true
        score += 15
    }
    
    if (password.length >= 12) {
        checks.long = true
        score += 15
    }
    
    const isCommon = commonPasswords.some(common => 
        password.toLowerCase().includes(common.toLowerCase())
    )
    
    if (!isCommon && password.length > 0) {
        checks.noCommon = true
        score += 15
    }
    
    updateCriteria(criteriaLength, checks.length)
    updateCriteria(criteriaSymbols, checks.symbols)
    updateCriteria(criteriaMixed, checks.mixed)
    updateCriteria(criteriaNumbers, checks.numbers)
    updateCriteria(criteriaLong, checks.long)
    updateCriteria(criteriaNoCommon, checks.noCommon)
    
    return Math.min(score, 100)
}

function getStrengthLabel(score) {
    if (score === 0) return 'No Password'
    if (score < 30) return 'Very Weak'
    if (score < 50) return 'Weak'
    if (score < 70) return 'Fair'
    if (score < 90) return 'Strong'
    return 'Very Strong'
}

function getStrengthClass(score) {
    if (score < 50) return 'weak'
    if (score < 70) return 'fair'
    return 'strong'
}

function updateStrengthMeter() {
    const password = passwordInput.value
    const score = checkPasswordStrength(password)
    
    strengthText.textContent = getStrengthLabel(score)
    strengthPercentage.textContent = score + '%'
    
    progressFill.style.width = score + '%'
    progressFill.className = 'progress-fill'
    
    if (score > 0) {
        progressFill.classList.add(getStrengthClass(score))
    }
}

function handleVerify() {
    const password = passwordInput.value
    
    if (password.length === 0) {
        shakeElement(passwordInput)
        return
    }
    
    const score = checkPasswordStrength(password)
    
    verifyBtn.innerHTML = '<span>Analyzing...</span>'
    verifyBtn.disabled = true
    
    setTimeout(() => {
        let message = ''
        
        if (score >= 70) {
            message = 'Password Verified: Strong Security'
        } else if (score >= 50) {
            message = 'Password Acceptable: Consider Improvements'
        } else {
            message = 'Password Weak: Needs Strengthening'
        }
        
        verifyBtn.innerHTML = `<span>${message}</span>`
        
        setTimeout(() => {
            verifyBtn.innerHTML = '<span>Verify Strength</span><span class="material-symbols-outlined btn-icon">arrow_forward</span>'
            verifyBtn.disabled = false
        }, 2500)
    }, 1000)
}

function shakeElement(element) {
    element.style.transform = 'translateX(-5px)'
    
    setTimeout(() => {
        element.style.transform = 'translateX(5px)'
    }, 100)
    
    setTimeout(() => {
        element.style.transform = 'translateX(-5px)'
    }, 200)
    
    setTimeout(() => {
        element.style.transform = 'translateX(0)'
    }, 300)
}

themeToggle.addEventListener('click', toggleTheme)

visibilityToggle.addEventListener('click', togglePasswordVisibility)

passwordInput.addEventListener('input', updateStrengthMeter)

verifyBtn.addEventListener('click', handleVerify)

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleVerify()
    }
})

loadTheme()
updateStrengthMeter()