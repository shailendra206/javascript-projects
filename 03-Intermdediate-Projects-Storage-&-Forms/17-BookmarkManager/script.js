let siteName
let siteUrl
const inputSiteName = document.getElementById('siteName')
const inputSiteUrl = document.getElementById('siteUrl')

inputSiteName.addEventListener('input',()=>{
    siteName = inputSiteName.value
})

inputSiteUrl.addEventListener('input',()=>{
    siteUrl = inputSiteUrl.value
})

const bookmarksList = document.querySelector('.bookmarks-list')

let bookmarks = []//bookmarks_array

const addBtn = document.querySelector('.add-button')


function returnLi(bookmark){
    return`<div class="bookmark-item" data-id="${bookmark.id}">
                <div class="bookmark-icon" style="text-transform: uppercase;">${bookmark.firstLetter}</div>
                <div class="bookmark-info">
                    <h3>${bookmark.name}</h3>
                    <a href="${bookmark.url}" target="_blank">${bookmark.url}</a>
                </div>
                <button class="btn-delete">🗑️</button>
            </div>`
}

function saveBookmarks() {
  localStorage.setItem(
    "bookmarks",
    JSON.stringify(bookmarks)
  );
}

function loadBookmarks() {
  const stored = localStorage.getItem("bookmarks");
  if (!stored) return;
  bookmarks = JSON.parse(stored);
}

function renderBookmarks() {
  bookmarksList.innerHTML = "";

  bookmarks.forEach(bookmark => {
    bookmarksList.insertAdjacentHTML(
      "afterbegin",
      returnLi(bookmark)
    );
  });
}

addBtn.addEventListener('click',(event)=>{
    event.preventDefault()
    const bookmarkObject = {
        firstLetter : siteName.charAt(0),
        id : Date.now(),
        name : siteName,
        url : siteUrl
    }
    bookmarks.push(bookmarkObject)
    saveBookmarks()
    bookmarksList.insertAdjacentHTML("afterbegin",returnLi(bookmarkObject));
    inputSiteName.value = ''
    inputSiteUrl.value = ''
    updateDisplay()
})

bookmarksList.addEventListener('click',(e)=>{
    const btn = e.target.closest('.btn-delete')
    if(!btn) return 
    const bookmarkItem = btn.closest('.bookmark-item')
    const id = Number(bookmarkItem.dataset.id)

    bookmarks = bookmarks.filter(
        item => item.id !== id
    )
    saveBookmarks()
    bookmarkItem.remove()
    updateDisplay()
})

const emptyState = document.querySelector('.empty-state')

function updateDisplay(){
    if(bookmarks.length === 0){
        emptyState.classList.remove('hidden')
    }else{
        emptyState.classList.add('hidden')
    }
}


loadBookmarks();
renderBookmarks();