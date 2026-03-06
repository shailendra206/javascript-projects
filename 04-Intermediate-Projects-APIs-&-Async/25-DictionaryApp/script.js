const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

//navbar
let navSearchBar = document.getElementById('navSearch')
let logo = document.getElementById('logoBtn')
let toggleTheme = document.getElementById('themeBtn')
let navBtn = document.getElementById('navBtn')
let navInput = document.getElementById('navInput')

//Landing page
let searchBtn = document.querySelector('.search-box__btn')
let landingPage = document.getElementById('pageLanding')
let landingPageInput = document.getElementById('landingInput')

//Main-page
let mainPage = document.getElementById('pageResults')
let word = document.getElementById('resWord')
let phonetic = document.getElementById('resPhonetic')
let mainPageContainer = document.querySelector('.results__main')

//Error page
let errorPage = document.getElementById('pageError')
let retryBtn = document.getElementById('retryBtn')

//loading overlay
let loadingOverlay = document.getElementById('loader')

//Navigation between pages

function gotoHomePage() {
    landingPage.classList.add('active')
    mainPage.classList.remove('active')
    errorPage.classList.remove('active')
    navSearchBar.style.display = 'none'
}
function gotoMainPage() {
    mainPage.classList.add('active')
    landingPage.classList.remove('active')
    errorPage.classList.remove('active')
    navSearchBar.style.display = 'block'
}
function gotoErrorPage() {
    errorPage.classList.add('active')
    landingPage.classList.remove('active')
    mainPage.classList.remove('active')
    navSearchBar.style.display = 'block'
}
logo.addEventListener('click', () => {
    gotoHomePage()
})
retryBtn.addEventListener('click',() => {
    gotoHomePage()
})
//change & save theme 

toggleTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark')
    if(document.body.classList.contains('dark')){
        localStorage.setItem('theme','dark')
    }else{
        localStorage.setItem('theme','light')
    }      
})

function loadTheme(){
    const savedTheme = localStorage.getItem('theme')
    if(savedTheme === 'dark'){
        document.body.classList.add('dark')
    }
}

loadTheme()

//API fetch

async function fetchApi(word){
    try{
        loadingOverlay.classList.remove('hide')
        const response = await fetch (`${API_URL}${word}`)
        const data = await response.json()
        renderData(data)
    }catch(error){
        gotoErrorPage()
    }finally{
        loadingOverlay.classList.add('hide')
    }
}

searchBtn.addEventListener('click', () => {  
    const value = landingPageInput.value.trim()
    if(value !== ''){
        landingPageInput.value = ''
        fetchApi(value)
        gotoMainPage()
    }
})
navBtn.addEventListener('click', () => {
    const value = navInput.value.trim()
    if(value !== ''){
        navInput.value = ''
        fetchApi(value)
        gotoMainPage()
    }
})
document.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && landingPage.classList.contains('active')){
        e.preventDefault()
        const value = landingPageInput.value.trim()
        if(value !== ''){
            landingPageInput.value = ''
            fetchApi(value)
            gotoMainPage()
        }
    }
    if(e.key === 'Enter' && (mainPage.classList.contains('active') || errorPage.classList.contains('active'))){
        e.preventDefault()
        const value = navInput.value.trim()
        if(value !== ''){
            navInput.value = ''
            fetchApi(value)
            gotoMainPage()
        }
    }
})

//display-data function
function renderData(data){
    let audioUrl = ''
    mainPageContainer.innerHTML = ''
    data[0].phonetics[0].audio ? audioUrl = data[0].phonetics[0].audio : audioUrl = ''
    let phonetic = 'Not Found'
    if(data[0].phonetic){
        phonetic = data[0].phonetic
    }
        
    mainPageContainer.innerHTML += `
        <div class="word-card">
          <div class="word-card__badge">
            <span class="material-icons">visibility</span>
          </div>
          <h2 class="word-card__word" id="resWord">${data[0].word}</h2>
          <div class="word-card__meta">
            <span class="word-card__phonetic" id="resPhonetic">${phonetic}</span>
            <button class="word-card__audio" id="audioBtn" aria-label="Play audio">
              <span class="material-icons">volume_up</span>
            </button>
          </div>
        </div>
        `
    data[0].meanings.slice(0,2).forEach(
        meaning => {
            mainPageContainer.innerHTML += `<div class="defs" id="defsBox">
              <div class="def-card">
                <div class="def-card__label">${meaning.partOfSpeech}</div>`
            meaning.definitions.slice(0,3).forEach(
                (definition,index) => {
                    if(index === 0){
                        mainPageContainer.innerHTML += `<div class="def-card__body">
                              <p class="def-card__text">${definition.definition}</p>
                            </div>
                          </div>`
                    }else{
                        mainPageContainer.innerHTML += `<div class="def-card def-card--indent">
                            <div class="def-card__body def-card__body--green">
                              <p class="def-card__text">${definition.definition}</p>
                            </div>
                          </div>`
                    }
                }
            )
            mainPageContainer.innerHTML += `</div>`
        }
    )
    mainPageContainer.innerHTML += `<div class="related">
            <div class="related__col">
              <h3 class="related__title related__title--green">
                <span class="material-icons">thumb_up</span> Synonyms
              </h3>
              <div class="related__tags" id="synBox">
                <!-- Items -->
              </div>
            </div>
            <div class="related__col">
              <h3 class="related__title related__title--red">
                <span class="material-icons">thumb_down</span> Antonyms
              </h3>
              <div class="related__tags" id="antBox">
                <!-- Item -->
              </div>
            </div>
          </div>`
    let synonyms = document.getElementById('synBox')
    let antonyms = document.getElementById('antBox')

    //synonyms-antonyms
    synonyms.innerHTML = ''
    antonyms.innerHTML = ''
    synList = data[0].meanings[0].synonyms.slice(0,4)
    antList = data[0].meanings[0].antonyms.slice(0,4)

    if (synList.length === 0) {
        synonyms.innerHTML = `<span class="tag tag--none">Not found</span>`
    }else{
        data[0].meanings[0].synonyms.slice(0,4).forEach(
            item => {
                synonyms.innerHTML += `<a href="#" class="tag tag--syn" data-word="${item}">${item}</a>`
            }
        )
    }
    
    if (antList.length === 0) {
        antonyms.innerHTML = `<span class="tag tag--none">Not found</span>`
    }else{
        data[0].meanings[0].antonyms.slice(0,4).forEach(
            item => {
                antonyms.innerHTML += `<a href="#" class="tag tag--syn" data-word="${item}">${item}</a>`
            }
        )
    }
    //Audio
    let audioBtn = document.getElementById('audioBtn')
    audioBtn.addEventListener('click', () => {
        if(audioUrl){
            const sound = new Audio(audioUrl)
            sound.play()
        }else{
            console.log('[We are sorry, no Audio data found for This word.]')
        }
    })

    //syn-ant btn-find
    let extraBtn = document.querySelectorAll('.tag')
    let extraContainer = document.querySelector('.related')
    extraContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.tag')
        if(!btn) return
        fetchApi(btn.dataset.word)
    })
}   







