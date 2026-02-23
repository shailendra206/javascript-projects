const textBox = document.getElementById('textArea')
let characters = document.getElementById('characters')
let words = document.getElementById('words')
let sentences = document.getElementById('sentences')
// console.log(textBox)
let str = ''
textBox.addEventListener('input',()=>{
    str = textBox.value
    updateDisplay()
})

function updateDisplay(){
    characters.textContent = str.length
    words.textContent = str.split(' ')
        .map(e => e.trim())
        .filter(e => e.length > 0)
        .length;
    
    sentences.textContent = str
      .split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .length;
 
}
