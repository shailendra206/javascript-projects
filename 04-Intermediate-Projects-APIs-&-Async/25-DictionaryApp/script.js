const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'


let searchInput = document.getElementById('searchInput')
let word = document.querySelector('.word-title')
let phonetic = document.querySelector('.phonetic')
let loader = document.querySelector('.loader')
let meaningsContainer = document.querySelector('.meanings-container')
let wordCard = document.querySelector('.word-card')
let errorState = document.getElementById('errorState')
let pos = document.querySelector('.pos-row')
let antonymList = document.getElementById('antList')
let emptyState = document.getElementById('emptyState')
let themeToggle = document.getElementById('themeToggle')
let wodBtn = document.getElementById('wodBtn')
let tryPills = document.querySelector('.try-pills')
let recentSection = document.getElementById('recentSection')
let recentList = document.querySelector('.recent-list')
let clearBtn = document.getElementById('clearBtn')
let sourceBox = document.querySelector('.source-box')
let link = sourceBox.querySelector("a")

let recentItemArr = []

let searchInputStr = null
searchInput.addEventListener('input',() => {
    if(searchInput.value !== ''){
        searchInputStr = searchInput.value.trim()
    }
})

document.addEventListener('keydown',(e) => {
    if(e.key === 'Enter'){
        searchInput.value = ''
        fetchData(searchInputStr)
    }
})



themeToggle.addEventListener('change',() => {
    document.body.classList.toggle('light-mode',themeToggle.checked)
})

wodBtn.addEventListener('click',()=>{
    fetchData(searchInputStr = 'Serendipity')
})

tryPills.addEventListener('click',(e) => {
    btn = e.target.closest('.try-pill')
    if(!btn) return
    fetchData(searchInputStr = btn.dataset.word)
})

clearBtn.addEventListener('click',() => {
    recentItemArr = []
    recentList.innerHTML = ''
    showRecentSection()
})

function showEmptyState(){
    loader.classList.add('hidden')
    wordCard.classList.add('hidden')
    errorState.classList.add('hidden')
    emptyState.classList.remove('hidden')
}
function showLoadingState(){
    loader.classList.remove('hidden')
    wordCard.classList.add('hidden')
    errorState.classList.add('hidden')
    emptyState.classList.add('hidden')
}
function showContainer(){
    loader.classList.add('hidden')
    wordCard.classList.remove('hidden')
    errorState.classList.add('hidden')
    emptyState.classList.add('hidden')
}
function showErrorState(){
    loader.classList.add('hidden')
    wordCard.classList.add('hidden')
    errorState.classList.remove('hidden')
    emptyState.classList.add('hidden')
}

function showRecentSection(){
    if(recentItemArr.length === 0){
        recentSection.classList.add('hidden')
    }else{
        recentSection.classList.remove('hidden')
    }
}

function fetchData(searchInputStr){
    showLoadingState()
    let url = `${API_URL}${searchInputStr}`
    fetch(url)
        .then(response => {
            if(!response.ok){
                showErrorState()
                throw new Error('damm!!')
            }
            return response.json()
        })
        .then(data => {
            recentItemArr.unshift(data[0].word)
            recentItemArr = recentItemArr.slice(0,5)
            recentList.insertAdjacentHTML('afterbegin',returnRecentItem(data))
            showRecentSection()

            // wordCard.innerHTML = ''
            displayCard(data)
            showContainer()
        })
        .catch(error => {
            showErrorState()
            console.log(error)
        })    
}

function returnRecentItem(data){
    return`<div class="recent-pill">
                <span>${data[0].word}</span>
                <span class="pill-x">✕</span>
            </div>`
}

recentList.addEventListener('click',(e) => {
    btn = e.target.closest('.pill-x')
    if (!btn) return
    const item = btn.closest('.recent-pill')
    item.remove()

    recentItemArr = recentItemArr.filter(
        word => word !== item.querySelector('span').textContent
    )
    showRecentSection()
})

function returnMeaningBlock(index){
    return `<div class="meaning-block" data-index="${index}">
            </div>`
}

function returnPos(meaning,index){
    return `<div class="pos-row">
                <span class="pos-tag noun">${meaning.partOfSpeech}</span>
                <div class="pos-line"></div>
            </div>

            <div class="defs-list" data-index="${index}">

            </div>`
}

function returndefinitionItem(item,index){
    return `<div class="def-item">
                <span class="def-num">${index + 1}</span>
                <div class="def-content">
                    <p class="def-text">${item.definition}</p>
                    <p class="def-example">${item.example ?? ""}</p>
                </div>
            </div>`
}

function returnSynonymDiv(index){
    return`<div class="pills-row" data-index="synonym-${index}">
                <span class="pills-label">Synonyms:</span>
            </div>`
}

function returnSynonymList(synonym){
    return `<button class="syn-pill">${synonym}</button>`
}

function returnAntonymDiv(index){
    return`<div class="pills-row" data-index="antonym-${index}">
                <span class="pills-label">Antonyms:</span>
            </div>`
}

function returnAntonymList(index){
    return `<button class="ant-pill">${index}</button>`
}

function displayCard(data){
    document.querySelectorAll('.meaning-block').forEach(el => el.remove())
    meaningsContainer.innerHTML = ''
    word.textContent = data[0].word
    phonetic.textContent = data[0].phonetic

    let meanings = data[0].meanings
    meanings.forEach( (meaning,index) => {

        let meaningBlock = null
        meaningsContainer.insertAdjacentHTML('beforebegin',returnMeaningBlock(index))

        document.querySelectorAll('.meaning-block').forEach(item => {
            if(Number(item.dataset.index) === index){
                meaningBlock = item
            }
        })
        
        meaningBlock.insertAdjacentHTML('beforeend',returnPos(meaning,index))

        let definitionList = null
        document.querySelectorAll('.defs-list').forEach(item => {
            if(Number(item.dataset.index) === Number(index)){
                definitionList = item
            }
        })

        let definitions = meaning.definitions.slice(0,3)
        definitions.forEach( (item,Index)=> {
            definitionList.insertAdjacentHTML('beforeend',returndefinitionItem(item,Index))
        })

        // Synonym-Part
        synonyms = meaning.synonyms.slice(0,4)
        if(synonyms.length !== 0){
            meaningBlock.insertAdjacentHTML('beforeend',returnSynonymDiv(index))
        }

        let synonymList = null
        document.querySelectorAll('.pills-row').forEach(item => {
            if(item.dataset.index === `synonym-${index}`){
                synonymList = item
            }
        })

        synonyms.forEach(synonym => {
            synonymList.insertAdjacentHTML('beforeend',returnSynonymList(synonym))
        })

        // Antonym-Part
        antonyms = meaning.antonyms.slice(0,4)
        
        if(antonyms.length !== 0){
            meaningBlock.insertAdjacentHTML('beforeend',returnAntonymDiv(index))
        }

        let antonymList = null
        document.querySelectorAll('.pills-row').forEach(item => {
            if(item.dataset.index === `antonym-${index}`){
                antonymList = item
            }
        })

        antonyms.forEach(antonym => {
            antonymList.insertAdjacentHTML('beforeend',returnAntonymList(antonym))
        })
    })

    link.textContent = `https://api.dictionaryapi.dev/api/v2/entries/en/${data[0].word}`
    link.href = `https://api.dictionaryapi.dev/api/v2/entries/en/${data[0].word}`
}

