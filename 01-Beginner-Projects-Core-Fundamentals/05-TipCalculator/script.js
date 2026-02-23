let input = document.getElementById('billAmount')
let amount //bill-Amount

input.addEventListener('input',()=>{
    amount = input.value
})

let allBtn = document.querySelector('.tip-buttons')
let eachBtn = document.querySelectorAll('.tip-btn')
let tipAmount //tip-Amount
allBtn.addEventListener('click',(e)=>{
    let btn = e.target.closest('[data-tip]')
    if(!btn) return
    eachBtn.forEach((e)=>{
        e.classList.remove('active')
    })
    btn.classList.add('active')
    tipAmount = totalTip(amount,btn.dataset.tip)
    updateDisplay()
})

let customTip = document.getElementById('customTip')
let customTipAmount
customTip.addEventListener('input',()=>{
    eachBtn.forEach((e)=>{
        e.classList.remove('active')
    })
    customTipAmount = customTip.value
    tipAmount = totalTip(amount,customTipAmount)
    updateDisplay()
})

function totalTip(bill,tip){
    let tipAmount = (bill * tip) / 100
    return tipAmount
}

let people = 1
let peopleUpdate = document.getElementById('peopleCount')
let decreasePeople = document.getElementById('decreasePeople')
let increasePeople = document.getElementById('increasePeople')

decreasePeople.addEventListener('click',()=>{
    if(people > 1){
        people--
        peopleUpdate.textContent = people
        updateDisplay()
    }
})
increasePeople.addEventListener('click',()=>{
    people++
    peopleUpdate.textContent = people
    updateDisplay()
})

let updateTipAmount = document.getElementById('tipAmount') //tip-per-person
let updateBill = document.getElementById('billPerPerson') //bill-per-person
// let updateTotalAmount = document.getElementById('totalAmount') //total-amount

function updateDisplay(){
    updateTipAmount.textContent = parseInt(tipAmount/people)
    updateBill.textContent = parseInt(amount/people)
    // updateTotalAmount.textContent = parseInt(amount) + parseInt(tipAmount)
}

let resetBtn = document.getElementById('resetBtn')
resetBtn.addEventListener('click',()=>{
    amount = 0
    input.value = ''
    customTipAmount = 0
    customTip.value = ''
    person = 1
    peopleUpdate.textContent = 1
    eachBtn.forEach((e)=>{
        e.classList.remove('active')
    })
    updateTipAmount.textContent = "0.00"
    updateBill.textContent = "0.00"
})