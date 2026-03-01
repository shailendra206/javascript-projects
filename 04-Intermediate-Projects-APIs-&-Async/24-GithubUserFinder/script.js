const apiLink = 'https://api.github.com/users/'

let searchInput = document.getElementById('searchInput')
let searchBtn = document.getElementById('searchBtn')
let userCard = document.getElementById('userCard')
let emptyState = document.getElementById('emptyState')
let loader = document.getElementById('loader')
let avatar = document.getElementById('avatar')
let userType = document.getElementById('userType')
let name = document.getElementById('name')
let username = document.getElementById('username')
let bio = document.getElementById('bio')
let repos = document.getElementById('repos')
let followers = document.getElementById('followers')
let following = document.getElementById('following')
let created = document.getElementById('created')
let profileLink = document.getElementById('profileLink')
let reposLink = document.getElementById('reposLink')
let errorState = document.getElementById('errorState')
let recentList = document.getElementById('recentList')
let clearAllBtn = document.getElementById('clearAllBtn')

let searchInputStr = ''
searchInput.addEventListener('input',()=>{
    searchInputStr = searchInput.value.trim()
})

document.addEventListener('keydown',(event)=>{
    if(event.key === 'Enter'){
        userdata(searchInputStr)
    }
})

function showUserCard(){
    loader.classList.add('hidden')
    userCard.classList.remove('hidden')
    emptyState.classList.add('hidden')
}
function showLoadingState(){
    loader.classList.remove('hidden')
    userCard.classList.add('hidden')
    emptyState.classList.add('hidden')
}


function userdata(searchInputStr){
    showLoadingState()
    
    let url = `${apiLink}${searchInputStr}`
    fetch(url)
        .then(response => {
            if(!response.ok){
                loader.classList.add('hidden')
                errorState.classList.remove('hidden')
                throw new Error('Not able to get the Response!!')
            }
            return response.json()
        })
        .then(data => {
            errorState.classList.add('hidden')
            displayUserInfo(data)
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

function displayUserInfo(data){
    showUserCard()
    avatar.src = data.avatar_url
    userType.textContent = data.type
    name.textContent = data.name
    username.textContent = `@${data.login}`
    bio.textContent = data.bio
    repos.textContent = data.public_repos
    followers.textContent = data.followers
    following.textContent = data.following

    let date = new Date(data.created_at)
    created.textContent = date.toLocaleDateString('en-US',{
        day: "2-digit",
        month: "short",
        year: "numeric"
    })

    profileLink.href = data.html_url
    reposLink.href = data.html_url
    handleRecentUser(data)
}

let userArray = []

function handleRecentUser(data){
    userArray.unshift(data)
    userArray = userArray.slice(0,5) //userArray.[0].
    recentList.innerHTML = ""
    userArray.forEach(
        item => {
            recentList.insertAdjacentHTML('beforeend',returnRecentItem(item))
        }
    )  
}

function returnRecentItem(data){
    return`<div class="recent-pill" data-index="${data.login}">
                <img src="${data.avatar_url}">
                <span>${data.name}</span>
                <button class="remove-pill">×</button>
            </div>`
}

recentList.addEventListener('click',(event)=>{
    const btn = event.target.closest('.remove-pill')
    if(!btn) return 
    const userDiv = btn.closest('.recent-pill')

    userArray = userArray.filter(
        item => {
            item.login !== userDiv.dataset.index
            userDiv.remove()
        }
    )
})

clearAllBtn.addEventListener('click',()=>{
    userArray = []
    recentList.innerHTML = ''
})

