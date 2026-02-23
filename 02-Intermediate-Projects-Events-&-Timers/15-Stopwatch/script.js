let startTime = 0 
let elapsedTime = 0
let timer = null
const startBtn = document.querySelector('.btn-start')
const stopBtn = document.querySelector('.btn-stop')
const resetBtn = document.querySelector('.btn-reset')
startBtn.addEventListener('click',()=>{
    startTime = Date.now() - elapsedTime

    timer = setInterval(()=>{
        elapsedTime = Date.now() - startTime;
        updateTime()
    },1000)

    stopBtn.disabled = false;
})

stopBtn.addEventListener('click',()=>{
    clearInterval(timer)
    console.log(elapsedTime)
    // updateTime()
})

resetBtn.addEventListener('click', () => {
  clearInterval(timer);
  timer = null;
  elapsedTime = 0;
  updateTime()
});

const updateHours = document.getElementById('hours')
const updateMinutes = document.getElementById('minutes')
const updateSeconds = document.getElementById('seconds')

function updateTime(){
    let totalSeconds = Math.floor(elapsedTime/1000)
    let hours = Math.floor(totalSeconds / (60*60))
    let minutes = Math.floor((totalSeconds / (60)) % 3600)
    let seconds = Math.floor(totalSeconds % 60)

    updateHours.textContent = hours
    updateMinutes.textContent = minutes
    updateSeconds.textContent = seconds
}