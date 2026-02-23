const previousOperand = document.getElementById('previousOperand')
const currentOperand = document.getElementById('currentOperand')

let allBtn = document.querySelector('.buttons')

let preValue = ''
let currValue = ''
let operator = ''

allBtn.addEventListener('click',(e)=>{
    const numberBtn = e.target.closest('[data-number]')
    const operatorBtn = e.target.closest('[data-operator]')
    const acBtn = e.target.closest('[data-clearAll]')
    const equalBtn = e.target.closest('[data-equal]')
    const deleteBtn = e.target.closest('[data-delete]')

    if(numberBtn){
        currValue += numberBtn.dataset.number
    }

    if(operatorBtn){
        preValue = currValue
        operator = operatorBtn.dataset.operator
        currValue = ''
    }

    if(acBtn){    
        currValue = ''
        preValue = ''
        operator = ''
    }

    if(equalBtn){
        currValue = calculate()
        operator = ''
        preValue = ''
    }
   
    if(deleteBtn){
        currValue = currValue.slice(0,(currValue.length - 1))
    }

    updateDisplay()
})

// keySupport --]
document.addEventListener('keydown', (e) => {

    if (e.key >= '0' && e.key <= '9') {
        currValue += e.key
    }

    if (['+', '-', '*', '/'].includes(e.key)) {
        if (currValue === '') return
        preValue = currValue
        operator = e.key
        currValue = ''
    }

    if (e.key === 'Enter') {
        e.preventDefault()
        if (preValue !== '' && currValue !== '') {
            currValue = calculate()
            operator = ''
            preValue = ''
        }
    }

    if (e.key === 'Backspace') {
        currValue = currValue.slice(0,(currValue.length - 1))
    }

    if (e.key === 'Escape') {
        currValue = ''
        preValue = ''
        operator = ''
    }

    updateDisplay()
})



function calculate(){
    let prev = parseFloat(preValue)
    let curr = parseFloat(currValue)
    let result = ''

    switch(operator){
        case '+' : 
            result = prev + curr;
            break;
        case '-' : 
            result = prev - curr;
            break;
        case '*' : 
            result = prev * curr;
            break;
        case '/' : 
            if(curr === 0){
                alert('⚠️ Cannot divide by zero!');
                return
            }else{
                result = prev / curr;
            }
            break;
        default : 
            console.log('choose a correct option !!')
    }
    return result;
}

function updateDisplay(){
    if(currValue === ''){
        currentOperand.textContent = '0'
    }else{
        currentOperand.textContent = currValue
    }

    if(operator === ''){
        //
    }else{
        currentOperand.textContent = `${preValue} ${operator} ${currValue}`
    }
}
