const step1 = document.getElementById('step1')
const step2 = document.getElementById('step2')
const step3 = document.getElementById('step3')

let currentStep = 1

const allForm = document.querySelectorAll('.form-step')
const progerssBar = document.querySelectorAll('.progress-bar .step')

function displayForm(currentStep){
    allForm.forEach(item => item.classList.remove('active'))

    const getVisibleForm = document.getElementById(`step${currentStep}`)

    getVisibleForm.classList.add('active')

    progerssBar.forEach(item=>{
        if(Number(item.dataset.step) <= currentStep){
            item.classList.add('active')
        }else{
            item.classList.remove('active')
        }
    })
}

allNextBtn = document.querySelectorAll('.next-btn')
allPrevBtn = document.querySelectorAll('.prev-btn')

allNextBtn.forEach(
    btn => {
        btn.addEventListener('click',()=>{
            currentStep++
            displayForm(currentStep)
        })
    }
)

allPrevBtn.forEach(
    btn => {
        btn.addEventListener('click',()=>{
            currentStep--
            displayForm(currentStep)
        })
    }
)

const fullName = document.getElementById('fullName')
const email = document.getElementById('email')
const username = document.getElementById('username')
const password = document.getElementById('password')

let fullNameStr = ''
let emailStr = ''
let usernameStr = ''
let passwordStr = ''

const reviewName = document.getElementById('reviewName')
const reviewEmail = document.getElementById('reviewEmail')
const reviewUsername = document.getElementById('reviewUsername')

fullName.addEventListener('input',()=>{
    fullNameStr = fullName.value
    reviewName.textContent = fullNameStr
})
email.addEventListener('input',()=>{
    emailStr = email.value
    reviewEmail.textContent = emailStr
})
username.addEventListener('input',()=>{
    usernameStr = username.value
    reviewUsername.textContent = usernameStr
})
password.addEventListener('input',()=>{
    passwordStr = password.value
})



