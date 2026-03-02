let textInput = document.querySelector('.text-input')
let charCount = document.querySelector('#char-count')
let wordCount = document.querySelector('#word-count')
let sentenceCount = document.querySelector
('#sentence-count')
let clearBtn = document.getElementById('clear-btn')
let copyBtn = document.getElementById('copy-btn')
let popMsg = document.querySelector('.toggle-btn')
let str = ''
textInput.addEventListener('input',() => {
    str = textInput.value
    updatDisplay()
    saveText(str)
})

const updatDisplay = () => {
    charCount.textContent = str.length.toString().padStart(4,'0')
    if(str.trim().length === 0){
        wordCount.textContent = (0).toString().padStart(4,'0')
    }else{
        wordCount.textContent = str.trim().split(/\s+/).length.toString().padStart(4,'0')
    }
    sentenceCount.textContent = str.split(/[.!?]+/).filter(e => e.trim().length > 0).length.toString().padStart(4,'0')
}

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(str)
    popMsg.textContent = 'Text copied.'
    setTimeout(() => {popMsg.textContent = 'Reality Mode'},2000)
})

clearBtn.addEventListener('click', () => {
    textInput.value = ''
    str = ''
    updatDisplay()
    saveText(str)
    popMsg.textContent = 'Text deleted.'
    setTimeout(() => {popMsg.textContent = 'Reality Mode'},2000)
})

const saveText = (str) => {
    localStorage.setItem('text',str)
}

const getText = () => {
    return localStorage.getItem('text')
}

window.addEventListener('DOMContentLoaded', () => {
    const savedText = getText()
    if(saveText){
        str = savedText
        textInput.textContent = str
        updatDisplay()
    }
})