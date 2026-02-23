const counter = document.getElementById('counter')
const btnIncrease = document.querySelector('.btn-increase')
const btnDecrease = document.querySelector('.btn-decrease')
const btnReset = document.querySelector('.btn-reset')

let count  = 0

btnIncrease.addEventListener('click',()=>{
    count++
    counter.textContent = count
})

btnDecrease.addEventListener('click',()=>{
    count--
    counter.textContent = count
})

btnReset.addEventListener('click',()=>{
    count = 0
    counter.textContent = count
})