const themeToggle = document.getElementById('themeToggle')
const themeIcon = document.getElementById('themeIcon')
const bookmarkTitle = document.getElementById('bookmarkTitle')
const bookmarkUrl = document.getElementById('bookmarkUrl')
const saveBtn = document.getElementById('saveBtn')
const bookmarksGrid = document.getElementById('bookmarksGrid')
const emptyState = document.getElementById('emptyState')

let bookmarks = []

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function saveToLocalStorage() {
    localStorage.setItem('archiveBookmarks', JSON.stringify(bookmarks))
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('archiveBookmarks')
    if (saved) {
        bookmarks = JSON.parse(saved)
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('archiveTheme')
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
        localStorage.setItem('archiveTheme', 'dark')
    } else {
        themeIcon.textContent = 'dark_mode'
        localStorage.setItem('archiveTheme', 'light')
    }
}

function formatUrl(url) {
    let formatted = url.replace(/^(https?:\/\/)?(www\.)?/, '')
    if (formatted.length > 35) {
        formatted = formatted.substring(0, 35) + '...'
    }
    return formatted
}

function getFullUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url
    }
    return url
}

function createBookmarkElement(bookmark) {
    const card = document.createElement('div')
    card.className = 'bookmark-card'
    card.dataset.id = bookmark.id
    
    card.innerHTML = `
        <div class="bookmark-header">
            <h3 class="bookmark-title">${bookmark.title}</h3>
            <button class="delete-btn">Delete</button>
        </div>
        <a class="bookmark-url" href="${getFullUrl(bookmark.url)}" target="_blank" rel="noopener noreferrer">${formatUrl(bookmark.url)}</a>
    `
    
    return card
}

function renderBookmarks() {
    bookmarksGrid.innerHTML = ''
    
    if (bookmarks.length === 0) {
        emptyState.classList.add('show')
        return
    }
    
    emptyState.classList.remove('show')
    
    bookmarks.forEach(bookmark => {
        const element = createBookmarkElement(bookmark)
        bookmarksGrid.appendChild(element)
    })
}

function addBookmark(title, url) {
    if (!title.trim() || !url.trim()) {
        shakeElement(saveBtn)
        return
    }
    
    const newBookmark = {
        id: generateId(),
        title: title.trim(),
        url: url.trim(),
        createdAt: new Date().toISOString()
    }
    
    bookmarks.unshift(newBookmark)
    saveToLocalStorage()
    renderBookmarks()
    clearInputs()
}

function deleteBookmark(id) {
    bookmarks = bookmarks.filter(bookmark => bookmark.id !== id)
    saveToLocalStorage()
    renderBookmarks()
}

function clearInputs() {
    bookmarkTitle.value = ''
    bookmarkUrl.value = ''
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

saveBtn.addEventListener('click', () => {
    const title = bookmarkTitle.value
    const url = bookmarkUrl.value
    addBookmark(title, url)
})

bookmarkTitle.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        bookmarkUrl.focus()
    }
})

bookmarkUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveBtn.click()
    }
})

bookmarksGrid.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn')
    if (deleteBtn) {
        const card = deleteBtn.closest('.bookmark-card')
        const id = card.dataset.id
        
        card.style.opacity = '0'
        card.style.transform = 'scale(0.9)'
        card.style.transition = 'opacity 0.3s, transform 0.3s'
        
        setTimeout(() => {
            deleteBookmark(id)
        }, 300)
    }
})

loadTheme()
loadFromLocalStorage()
renderBookmarks()