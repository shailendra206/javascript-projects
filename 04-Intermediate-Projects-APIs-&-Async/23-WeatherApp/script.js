import { HIDDEN_API_KEY } from "./config.js";

const API_KEY = HIDDEN_API_KEY;
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?';
const BASE_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast?'

//navbar
let toggleMainTheme = document.getElementById('theme-toggle-main')
let navSearchBar = document.querySelector('.nav-search-bar')
let navSearchInput = document.getElementById('nav-search-input')
let navLocationBtn = document.getElementById('nav-location-btn')
//landing-page
let landingInput = document.getElementById('landing-search-input')
let landingExploreBtn = document.getElementById('landing-explore-btn')
let landingPage = document.getElementById('page-landing')
let mainPage = document.getElementById('page-main')
let landingLocationBtn = document.getElementById('landing-location-btn')

//Main-page-Content
let cityName = document.getElementById('city-name')
let currentTemp = document.getElementById('current-temp')
let currentDesc = document.getElementById('current-desc')

//cards-Grid 
let humidity = document.getElementById('card-humidity')
let humidityExtra = document.getElementById('card-humidity-extra')
let wind = document.getElementById('card-wind')
let windExtra = document.getElementById('card-wind-extra')
let cloud = document.getElementById('card-uv')
let cloudExtra = document.getElementById('card-uv-extra')
let visibility = document.getElementById('card-visibility')
let visibilityExtra = document.getElementById('card-visibility-extra')
let pressure = document.getElementById('card-pressure')
let pressureExtra = document.getElementById('card-pressure-extra')
let feelsLike = document.getElementById('card-feelslike')
let feelsLikeExtra = document.getElementById('card-feelslike-extra')

//all cards
let allCard = document.querySelectorAll('.card-animate')
const forecastContainer = document.getElementById('forecast-container') //Forecast-container

//sidebar
const historyList = document.getElementById('history-list')
const clearHistoryBtn = document.getElementById('clear-history-btn')


//Error-page 
const errorPage = document.getElementById('page-error')
const errorMsg = document.getElementById('error-message')
const loadingOverlay = document.getElementById('loading-overlay')

let inputStr = ''
let extraInfo
let historyArr = []


//API-fetch
async function getWeatherApi(city) {
    try {
        const response = await fetch(`${BASE_WEATHER_URL}q=${city}&appid=${API_KEY}&units=metric`)
        const data = await response.json()
        if (data.cod === 200){
            updateBasicInfo(data)
            extraInfo = getExtraInfo(data)
            displayCardsGrid(data)
            updateSolarCycle(data)
            saveToHistory(data)
        }else{
            errorMsg.textContent = data.message
            errorPage.classList.remove('hidden')
            mainPage.classList.add('hidden')
        }
    } catch (error) {
        errorMsg.textContent = 'connection Failed'
        errorPage.classList.remove('hidden')
    }
}

async function getForecastApi(city) {
    try {
        const response = await fetch(`${BASE_FORECAST_URL}q=${city}&appid=${API_KEY}&units=metric`)
        const data = await response.json()
        if(data.cod === '200'){
            getForecastdata(data)
        }else{
            errorMsg.textContent = data.message
            errorPage.classList.remove('hidden')
            mainPage.classList.add('hidden')
        }
    }catch(error){
        errorMsg.textContent = 'connection Failed'
        errorPage.classList.remove('hidden')
    }
}

//landing page

landingInput.addEventListener('input', () => {
    inputStr = landingInput.value
})
landingExploreBtn.addEventListener('click', async () => {
    if(inputStr.trim() === '') return
    landingInput.value = ''
    loadingOverlay.classList.remove('hidden')

    landingPage.classList.add('hidden')
    mainPage.classList.remove('hidden')
    navSearchBar.classList.remove('hidden')

    await getWeatherApi(inputStr)
    await getForecastApi(inputStr)

    loadingOverlay.classList.add('hidden')
})
document.addEventListener('keydown', async (e) => {
    if(e.key === 'Enter' && inputStr.trim()){
        loadingOverlay.classList.remove('hidden')
        landingInput.value = ''
        landingPage.classList.add('hidden')
        mainPage.classList.remove('hidden')
        navSearchBar.classList.remove('hidden')

        await getWeatherApi(inputStr)
        await getForecastApi(inputStr)

        loadingOverlay.classList.add('hidden')
    }
})



//Main-page
navSearchInput.addEventListener('input', () => {
    inputStr = navSearchInput.value
})
navSearchBar.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter'){
        loadingOverlay.classList.remove('hidden')

        navSearchInput.value = ''
        landingInput.value = ''
        await getWeatherApi(inputStr)
        await getForecastApi(inputStr)

        loadingOverlay.classList.add('hidden')
    }
})


const updateBasicInfo = (data) => {
    cityName.textContent = data.name
    currentTemp.textContent = `${Math.round(data.main.temp)}°C`
    currentDesc.textContent = data.weather[0].description.charAt(0).toUpperCase()+data.weather[0].description.slice(1)
}

function getExtraInfo(data) {
    return {
        humidity: data.main.humidity < 30 ? 'Low - Dry' : data.main.humidity < 60 ? 'Comfortable' : 'High - Humid',
        wind: data.wind.speed < 3 ? 'Calm' : data.wind.speed < 8 ? 'Light breeze' : data.wind.speed < 15 ? 'Moderate wind' : 'Strong wind',
        cloud: data.clouds.all < 20 ? 'Clear sky' : data.clouds.all < 50 ? 'Partly cloudy' : data.clouds.all < 80 ? 'Mostly cloudy' : 'Overcast',
        visibility: data.visibility < 1000 ? 'Poor - Foggy' : data.visibility < 5000 ? 'Moderate' : 'Clear',
        pressure: data.main.pressure < 1000 ? 'Low pressure' : data.main.pressure < 1020 ? 'Normal' : 'High pressure',
        feelsLike: (data.main.feels_like - data.main.temp) > 2 ? 'Warmer than actual' : (data.main.feels_like - data.main.temp) < -2 ? 'Colder than actual' : 'Similar to actual'
    }
}


function displayCardsGrid(data) {
    allCard.forEach(card => card.classList.add('animate-in'))
    humidity.textContent = `${data.main.humidity} %`
    humidityExtra.textContent = extraInfo.humidity
    wind.textContent = `${data.wind.speed} m/s`
    windExtra.textContent = extraInfo.wind
    cloud.textContent = `${data.clouds.all} %`
    cloudExtra.textContent = extraInfo.cloud
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`
    visibilityExtra.textContent = extraInfo.visibility
    pressure.textContent = `${data.main.pressure} hPa`
    pressureExtra.textContent = extraInfo.pressure
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`
    feelsLikeExtra.textContent = extraInfo.feelsLike
}


function getForecastdata(data){
    const wholeList = data.list
    let groupedDate = {}
    wholeList.forEach(
        item => {
            let date = item.dt_txt.split(' ')[0]
            if(!groupedDate[date])
                groupedDate[date] = []
            groupedDate[date].push(item)
        }
    )
    const forecastData = [] //refined data of 5 days Forecast.
    Object.keys(groupedDate).forEach(
        date => {
            const items = groupedDate[date] //array of 8 objects
            const noonItem = items.find(item => item.dt_txt.includes('12:00:00'))
            const dayName = new Date(date).toLocaleDateString('en', { weekday: 'short' }).toUpperCase()
            const weather = noonItem ? noonItem.weather[0].main : items[0].weather[0].main
            const maxTemp = Math.max(...items.map(item => item.main.temp_max))
            const minTemp = Math.min(...items.map(item => item.main.temp_min))

            forecastData.push({
                day : dayName,
                weather : weather,
                max : maxTemp,
                min : minTemp
            })
        }
    )
    forecastContainer.innerHTML = ''
    forecastData.forEach(day => {
        forecastContainer.innerHTML += `
        <div class="forecast-card">
            <div class="forecast-day">${day.day}</div>
            <span class="material-symbols-outlined forecast-icon">${getWeatherIcon(day.weather)}</span>
            <div class="forecast-temp-high">${Math.round(day.max)}°C</div>
            <div class="forecast-temp-low">${Math.round(day.min)}°C</div>
        </div>
        `
    })
}   

// Format timestamp to readable time
function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString('en', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
}

//sun position
function getSunPosition(sunrise, sunset, timezone) {
    const now = (Date.now() / 1000) + timezone - (new Date().getTimezoneOffset() * 60)
    
    if (now < sunrise) return 0
    if (now > sunset) return 100
    return ((now - sunrise) / (sunset - sunrise)) * 100
}

//position sun on arc
function updateSolarCycle(data) {
    document.getElementById('sunrise-time').textContent = formatTime(data.sys.sunrise)
    document.getElementById('sunset-time').textContent = formatTime(data.sys.sunset)
    
    const percentage = getSunPosition(data.sys.sunrise, data.sys.sunset, data.timezone)
    const angle = 180 - (percentage * 1.8)
    const radians = angle * (Math.PI / 180)
    const radius = 90
    
    const x = radius * Math.cos(radians)
    const y = radius * Math.sin(radians)
    
    const sunIcon = document.getElementById('solar-sun-position')
    sunIcon.style.left = `calc(50% + ${x}px)`
    sunIcon.style.bottom = `${y + 40}px`
}

//to get weather icon.

function getWeatherIcon(weather) {
    const icons = {
        'Clear': 'light_mode',
        'Clouds': 'cloud',
        'Rain': 'rainy',
        'Drizzle': 'grain',
        'Thunderstorm': 'thunderstorm',
        'Snow': 'ac_unit',
        'Mist': 'mist',
        'Fog': 'foggy',
        'Haze': 'blur_on'
    }
    return icons[weather] || 'cloud'
}



//Geolocation : 
async function successCallback(position){
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    await getWeatherFromLocation(lat,lon)
    await getForecastFromLocation(lat,lon)

    loadingOverlay.classList.add('hidden')
}
function errorCallback(error){
    console.error('Loaction Error:',error.message)
    loadingOverlay.classList.add('hidden')
    errorMsg.textContent = 'Could not get location'
    errorPage.classList.remove('hidden')
}

navLocationBtn.addEventListener('click', () => {
    loadingOverlay.classList.remove('hidden')
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
})

landingLocationBtn.addEventListener('click', () => {
    loadingOverlay.classList.remove('hidden')

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback)

    landingPage.classList.add('hidden')
    mainPage.classList.remove('hidden')
    navSearchBar.classList.remove('hidden')
})

async function getWeatherFromLocation(LAT,LON){
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(WEATHER_URL)
        const data = await response.json()
        updateBasicInfo(data)
        extraInfo = getExtraInfo(data)
        displayCardsGrid(data)
        updateSolarCycle(data)
        saveToHistory(data)
    } catch (error) {
        console.error(error)
    } 
    
}
async function getForecastFromLocation(LAT,LON){
    const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`;

    try{
        const response = await fetch(FORECAST_URL)
        const data = await response.json()
        getForecastdata(data)
    }catch(error){
        console.log(error)
    }
}


//Save to History : 
function saveToHistory(data) {
    const exist = historyArr.some(item => item.name === data.name)
    if (exist) return 
    
    historyArr.unshift(data)

    if(historyArr.length > 5){
        historyArr.pop()
    }
    localStorage.setItem('savedHistory',JSON.stringify(historyArr))
    renderHistory()
}

function renderHistory(){
    historyList.innerHTML = ''
    historyArr.forEach(
        item => {
            historyList.innerHTML += `
                <li>
                    <div class="sidebar-item" data-city="${item.name}">
                        <div class="sidebar-item-top">
                            <span class="sidebar-item-city">${item.name}</span>
                            <span class="sidebar-item-temp">${item.main.temp}°C</span>
                        </div>
                        <div class="sidebar-item-bottom">
                            <span>${item.weather[0].description}</span>
                            <span class="material-symbols-outlined">chevron_right</span>
                        </div>
                    </div>
                </li>`
        }
    )
}

historyList.addEventListener('click', (e) => {
    const item = e.target.closest('.sidebar-item')
    if(!item) return
    const city = item.dataset.city
    getWeatherApi(city)
    getForecastApi(city)
    mainPage.scrollIntoView({behavior:'smooth'})
        
})

clearHistoryBtn.addEventListener('click', () => {
    historyArr = []
    historyList.innerHTML = ''
    localStorage.setItem('savedHistory',JSON.stringify(historyArr))
})
function loadHistory(){
    const data = localStorage.getItem('savedHistory')
    try {
        historyArr = data ? JSON.parse(data) : [] 
    }catch(error){
        historyArr = []
    }
    renderHistory()
}
loadHistory()


//changing Theme
function toggleTheme() {
    document.documentElement.classList.toggle('dark')
    const isDark = document.documentElement.classList.contains('dark')
    isDark ? localStorage.setItem('theme','dark') : localStorage.setItem('theme','light')
}
toggleMainTheme.addEventListener('click', () => {
    toggleTheme()
})

document.querySelector('.nav-brand').addEventListener('click', () => {
    mainPage.classList.add('hidden')
    errorPage.classList.add('hidden')
    landingPage.classList.remove('hidden')
    navSearchBar.classList.add('hidden')
})

document.getElementById('retry-btn').addEventListener('click', () => {
    errorPage.classList.add('hidden')
    landingPage.classList.remove('hidden')
    navSearchBar.classList.add('hidden')
})





