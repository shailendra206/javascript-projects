const themeToggle = document.getElementById('themeToggle')
const themeIcon = document.getElementById('themeIcon')
const noteInput = document.getElementById('noteInput')
const addNoteBtn = document.getElementById('addNoteBtn')
const notesGrid = document.getElementById('notesGrid')
const emptyState = document.getElementById('emptyState')

let notes = []

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function saveToLocalStorage() {
    localStorage.setItem('editorialNotes', JSON.stringify(notes))
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('editorialNotes')
    if (saved) {
        notes = JSON.parse(saved)
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('editorialTheme')
    if (savedTheme === 'dark') {
        document.body.classList.add('dark')
        themeIcon.textContent = 'light_mode'
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark')
    const isDark = document.body.classList.contains('dark')
    
    if (isDark) {
        themeIcon.textContent = 'light_mode'
        localStorage.setItem('editorialTheme', 'dark')
    } else {
        themeIcon.textContent = 'dark_mode'
        localStorage.setItem('editorialTheme', 'light')
    }
}

function generateTitle(content) {
    const words = content.trim().split(/\s+/)
    const titleWords = words.slice(0, 3)
    let title = titleWords.join(' ')
    
    if (words.length > 3) {
        title += '...'
    }
    
    return title.charAt(0).toUpperCase() + title.slice(1)
}

function formatDate(dateString) {
    const date = new Date(dateString)
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }
    return date.toLocaleDateString('en-US', options)
}

function createNoteElement(note) {
    const card = document.createElement('div')
    card.className = 'note-card'
    card.dataset.id = note.id
    
    card.innerHTML = `
        <div class="note-header">
            <h3 class="note-title">${note.title}</h3>
            <button class="delete-btn">Delete</button>
        </div>
        <p class="note-content">${note.content}</p>
        <p class="note-date">${formatDate(note.createdAt)}</p>
    `
    
    return card
}

function renderNotes() {
    notesGrid.innerHTML = ''
    
    if (notes.length === 0) {
        emptyState.classList.add('show')
        return
    }
    
    emptyState.classList.remove('show')
    
    notes.forEach(note => {
        const element = createNoteElement(note)
        notesGrid.appendChild(element)
    })
}

function addNote(content) {
    if (!content.trim()) {
        shakeElement(addNoteBtn)
        return
    }
    
    const newNote = {
        id: generateId(),
        title: generateTitle(content),
        content: content.trim(),
        createdAt: new Date().toISOString()
    }
    
    notes.unshift(newNote)
    saveToLocalStorage()
    renderNotes()
    clearInput()
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id)
    saveToLocalStorage()
    renderNotes()
}

function clearInput() {
    noteInput.value = ''
}

function shakeElement(element) {
    element.style.transform = 'translateX(-5px)'
    
    setTimeout(() => {
        element.style.transform = 'translateX(5px)'
    }, 100)
    
    setTimeout(() => {
        element.style.transform = 'translateX(-5px)'
    }, 200)
    
    setTimeout(() => {
        element.style.transform = 'translateX(0)'
    }, 300)
}

themeToggle.addEventListener('click', toggleTheme)

addNoteBtn.addEventListener('click', () => {
    const content = noteInput.value
    addNote(content)
})

noteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        addNoteBtn.click()
    }
})

notesGrid.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn')
    if (deleteBtn) {
        const card = deleteBtn.closest('.note-card')
        const id = card.dataset.id
        
        card.style.opacity = '0'
        card.style.transform = 'scale(0.9)'
        card.style.transition = 'opacity 0.3s, transform 0.3s'
        
        setTimeout(() => {
            deleteNote(id)
        }, 300)
    }
})

loadTheme()
loadFromLocalStorage()
renderNotes()