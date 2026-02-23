const todoInput = document.getElementById('todoInput') //Input
const addBtn = document.querySelector('.add-btn') //plus-Btn
let arr = [] //Todo-List-Array
let inputStr = '' //Temporary-string-Hold
let ul = document.getElementById('todoList') //unorder-List
// const deleteBtn = document.querySelector('.delete-btn')
let todoList = document.querySelectorAll('.todo-item') //appended List item


todoInput.addEventListener('input',(e)=>{
    inputStr = todoInput.value
})


function returnLiBox(text,index){
    return`<li class="todo-item" data-index="${index}">
            <div class="todo-content">
                <input type="checkbox" class="checkbox" id="todo1">
                <label for="todo1" class="todo-text">${text}</label>
            </div>
            <button class="delete-btn" title="Delete">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </li>`
}
// ul.insertAdjacentHTML('beforeend',returnLiBox(inputStr))

let index = (arr.length - 1)
addBtn.addEventListener('click',()=>{
    arr.push(inputStr)
    index = (arr.length - 1)
    ul.insertAdjacentHTML('beforeend',returnLiBox(inputStr,index))
    todoInput.value = ''
})

ul.addEventListener('click',(e)=>{
    const box = e.target.closest('[data-index]')
    const btn = e.target.closest('.delete-btn')
    
    if(!btn) return

    box.remove()
    arr[box.dataset.index] = ''
    console.log(arr)
})
const clearBtn = document.querySelector('.clear-btn')
function clear(){
    const list = ul.querySelectorAll('li');
    index = (arr.length - 1)
    list.forEach( e => {
       const checkbox = e.querySelector('input[type="checkbox"]')
        if(checkbox.checked){
            e.remove()
        }
    })
}
clearBtn.addEventListener('click',()=>{
    clear()
})

const tab = document.querySelectorAll('.tab')
const completedTab = document.querySelector('[data-filter="completed"]')
const activeTab = document.querySelector('[data-filter="active"]')
const allTab = document.querySelector('[data-filter="all"]')

completedTab.addEventListener('click',()=>{
    tab.forEach((e)=>{
        e.classList.remove('active')
    })
    completedTab.classList.add('active')
    const list = ul.querySelectorAll('li');
    list.forEach( e => {
        const checkbox = e.querySelector('input[type="checkbox"]')
        if(checkbox.checked){
            e.style.display = 'flex'
        }else{
            e.style.display = 'none'
        }
    })

})

activeTab.addEventListener('click',()=>{
    tab.forEach((e)=>{
        e.classList.remove('active')
    })
    activeTab.classList.add('active')
    const list = ul.querySelectorAll('li');
    list.forEach( e => {
        const checkbox = e.querySelector('input[type="checkbox"]')
        if(checkbox.checked){
            e.style.display = 'none'
        }else{
            e.style.display = 'flex'
        }
    })
})


allTab.addEventListener('click',()=>{
    tab.forEach((e)=>{
        e.classList.remove('active')
    })
    allTab.classList.add('active')
    const list = ul.querySelectorAll('li');
    list.forEach( e => {
        e.style.display = 'flex'
    })
})

