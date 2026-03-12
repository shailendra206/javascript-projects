const inputs = document.querySelectorAll('.timer-input')
const countdownTimer = document.querySelectorAll('.countdown-number')
const sections = document.querySelectorAll('.section')
const setTimerBtn = document.querySelector('.btn-set-timer')
let totalseconds = 0;
let elapsedTime = 0;
let intervalId = null
let isRunning = false
let initialSeconds = 0

setTimerBtn.addEventListener('click', () => {
    const days = Number(inputs[0].value) || 0
    const hours = Number(inputs[1].value) || 0
    const minutes = Number(inputs[2].value) || 0
    const seconds = Number(inputs[3].value) || 0
    totalseconds = Number(days*86400 + hours*3600 + minutes*60 + seconds)
    initialSeconds = Number(totalseconds)
    elapsedTime = 0
    switchsection()
    displayTime()
    displayElapsedTime(elapsedTime)
    calculatePercentage()
})

function switchsection(){
    if(sections[0].classList.contains('is-hidden')){
        sections[0].classList.remove('is-hidden')
        sections[1].classList.add('is-hidden')
    }else{
        sections[0].classList.add('is-hidden')
        sections[1].classList.remove('is-hidden')
    }
    
}

function displayTime(){
    const d = Math.floor(totalseconds / 86400)
    const h = Math.floor((totalseconds % 86400) / 3600)
    const m = Math.floor((totalseconds % 3600) / 60)
    const s = totalseconds % 60

    countdownTimer[0].textContent = String(d).padStart(2, '0')
    countdownTimer[1].textContent = String(h).padStart(2, '0')
    countdownTimer[2].textContent = String(m).padStart(2, '0')
    countdownTimer[3].textContent = String(s).padStart(2, '0')
}

const startBtn = document.querySelector('.btn-start')
const resetBtn = document.querySelector('.btn-reset')
const pauseBtn = document.querySelector('.btn-pause')
let displayElapsedTimeText = document.getElementById('elapsedTime') 
let progressText = document.querySelector('.progress-text')
let progressFill = document.querySelector('.progress-fill')

startBtn.addEventListener('click',() => {
    if(isRunning) return
    if(totalseconds === 0) return
    isRunning = true
    pauseBtn.classList.remove('btn-disabled')
    startBtn.classList.add('btn-disabled')
    clearInterval(intervalId)
    intervalId = setInterval(() => {
        totalseconds--
        elapsedTime++
        displayTime()
        displayElapsedTime(elapsedTime)
        calculatePercentage()
        if(totalseconds <= 0){
            clearInterval(intervalId)
            isRunning = false
            startBtn.classList.remove('btn-disabled')
        }   
    },1000)
})

pauseBtn.addEventListener('click', () => {
    clearInterval(intervalId) 
    isRunning = false
    startBtn.classList.remove('btn-disabled')
    pauseBtn.classList.add('btn-disabled')
})

resetBtn.addEventListener('click', () => {
    clearInterval(intervalId)  
    isRunning = false          
    switchsection()
    
    // Clear inputs
    inputs[0].value = ''
    inputs[1].value = ''
    inputs[2].value = ''
    inputs[3].value = ''
    
    elapsedTime = 0
    totalseconds = 0
    initialSeconds = 0
    
    startBtn.classList.remove('btn-disabled')
    pauseBtn.classList.remove('btn-disabled')
})

function displayElapsedTime(time){
    time = Number(time)
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)
    displayElapsedTimeText.textContent = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
}

function calculatePercentage(){
    percentage = Math.floor((elapsedTime / initialSeconds) * 100)
    progressText.textContent = `${percentage}%`
    progressFill.style.width =  `${percentage}%`
}