let currentIndex = 0
let score = 0

const startScreen = document.getElementById('startScreen')
startScreen.addEventListener('click',()=>{
    startScreen.classList.add('hidden')
    showQuestion(currentIndex)
})

const allQuestion = document.querySelectorAll('.quiz-screen')

function showQuestion(currentIndex){
    allQuestion.forEach((item,index) =>{
        if(index === currentIndex){
            item.classList.remove('hidden')
            const updateScore = item.querySelector('.score')
            updateScore.textContent = score
        }else{
            item.classList.add('hidden')
        }
    })
}

const nextBtn = document.querySelectorAll(".next-btn");

allQuestion.forEach( (optionContainer)=>{
    optionContainer.addEventListener('click',(e)=>{
        const btn = e.target.closest('[data-correct]')
        const nextBtn = optionContainer.querySelector(".next-btn");
        const updateScore = optionContainer.querySelector('.score')
        const selctAllOption = optionContainer.querySelectorAll('.option-btn')
        if(!btn) return
        if(btn.dataset.correct === 'true'){
            btn.classList.add('correct')
            nextBtn.disabled = false
            score++
            updateScore.textContent = score
        }else{
            btn.classList.add('wrong')
            selctAllOption.forEach((item)=>{
                if(item.dataset.correct === 'true'){
                    item.classList.add('correct')
                }
            })
            nextBtn.disabled = false
        }
    })
})

nextBtn.forEach((item)=>{
    item.addEventListener('click',()=>{
        currentIndex++
        showQuestion(currentIndex)
    })
})

const resultScreenBtn = document.querySelector('[data-next="resultScreen"]')
const resultScreen = document.querySelector('.result-screen')
const LastQuestion = document.getElementById('question5')
resultScreenBtn.addEventListener('click',()=>{
    LastQuestion.classList.add('hidden')
    updateResultScreen()
    resultScreen.classList.remove('hidden')
})

const finalScore = document.getElementById('finalScore')
const updatepercentage = document.getElementById('resultMessage')

function updateResultScreen(){
    let percentage = (score/5)*100
    finalScore.textContent = `${score}/5`
    updatepercentage.textContent = `You got ${percentage}% correct!`
}

const playAgain = document.getElementById('restartBtn')
playAgain.addEventListener('click',()=>{
    resultScreen.classList.add('hidden')
    startScreen.classList.remove('hidden')
})