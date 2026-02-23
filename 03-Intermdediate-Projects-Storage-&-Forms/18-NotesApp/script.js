function returnLi(noteList){
    return`<div class="note-card" data-id="${noteList.id}">
            <p class="note-text">${noteList.text}</p>
            <div class="note-footer">
                <span class="note-date">${noteList.date}</span>
                <button class="btn-delete">🗑️</button>
            </div>
        </div>`
}
const notes = document.querySelector('.notes-grid')
const addBtn = document.getElementById('addNoteBtn')
let noteInput = document.getElementById('noteInput')

let notesArr = []

let noteStr
noteInput.addEventListener('input',()=>{
    noteStr = noteInput.value
})

function saveNotes(){
    localStorage.setItem(
        "notesArr",
        JSON.stringify(notesArr)
    )
}

function loadNotes(){
    const stored = localStorage.getItem("notesArr");
    if(!stored) return
    notesArr = JSON.parse(stored)
}

function renderNotes(){
    notes.innerHTML = ""

    notesArr.forEach(item=>{
        notes.insertAdjacentHTML('afterbegin',returnLi(item))
    })
}

addBtn.addEventListener('click',()=>{
    const dateStr = new Date(Date.now()).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });

    const noteList = {
        id : Date.now(),
        text : noteStr,
        date : dateStr
    }

    notesArr.push(noteList)

    notes.insertAdjacentHTML('afterbegin',returnLi(noteList))
    saveNotes()
    noteInput.value = ''
    updateDisplay()
})

notes.addEventListener('click',(e)=>{
    const btn = e.target.closest('.btn-delete')
    if(!btn) return

    const noteItem = btn.closest('.note-card')
    const id = Number(noteItem.dataset.id)

    notesArr = notesArr.filter(
        item => item.id !== id
    )
    saveNotes()
    noteItem.remove()
    updateDisplay()
})

const emptyState = document.getElementById('emptyState')
function updateDisplay(){
    if(notesArr.length === 0){
        emptyState.classList.remove('hidden')
    }else{
        emptyState.classList.add('hidden')
    }
}

loadNotes()
renderNotes()