const targetDate = new Date('Jan 5, 2026 17:45:00').getTime();

function updateTimer(){
    const now = new Date()
    const diff = targetDate - now;
    
    if(diff <= 0){
        const msg = document.querySelector('.message')
        msg.classList.add('active')
        return;
    }
    
    const totalSeconds = Math.floor(diff / 1000)
    const days = Math.floor(totalSeconds / (60 * 60 * 24))
    const hours = Math.floor((totalSeconds / (60 * 60)) % 24 )
    const minutes = Math.floor((totalSeconds/(60)) % 60)
    const seconds = Math.floor(totalSeconds % 60)

    const daysUpdate = document.getElementById('days');
    const hoursUpdate = document.getElementById('hours');
    const minutesUpdate = document.getElementById('minutes');
    const secondsUpdate = document.getElementById('seconds');

    daysUpdate.textContent = days
    hoursUpdate.textContent = hours
    minutesUpdate.textContent = minutes
    secondsUpdate.textContent = seconds
}


updateTimer();
setInterval(updateTimer, 1000);