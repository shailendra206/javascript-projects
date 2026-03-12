let timerText = document.querySelector('.timer-value')
let startBtn = document.querySelector('.btn-primary')
let stopBtn = document.getElementById('stopBtn')
let resetBtn = document.getElementById('resetBtn')
let days=null,hours=null,minutes=null,seconds=null
let totalSeconds = 0
let intervalId = null
let isRunning = false

startBtn.addEventListener('click', () => {
    displayTime()
})
stopBtn.addEventListener('click', () => {
    clearInterval(intervalId)
    isRunning = false
})
resetBtn.addEventListener('click', () => {
    clearInterval(intervalId)
    isRunning = false
    timerText.textContent = '00:00:00:00'
    totalSeconds = 0
    intervalId = null
})
function displayTime(){
    if(isRunning) return
    isRunning = true
    intervalId = setInterval(() => {
        totalSeconds++
        updateDisplay(totalSeconds)
    },1000)
}

function updateDisplay(totalSeconds){
    days = String(Math.floor(Number (totalSeconds / 86400) )).padStart(2, '0')
    hours = String(Math.floor(Number (totalSeconds % 86400) / 3600)).padStart(2, '0')
    minutes = String(Math.floor(Number (totalSeconds % 3600) / 60)).padStart(2, '0')
    seconds = String(Math.floor(Number (totalSeconds % 60))).padStart(2, '0')
    timerText.textContent = `${days}:${hours}:${minutes}:${seconds}`
}