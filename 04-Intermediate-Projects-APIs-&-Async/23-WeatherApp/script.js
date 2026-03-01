import { API_KEY } from "./config.js"
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

const searchInput = document.querySelector('.search-input')
const searchBtn = document.querySelector('.search-btn')
const locationBtn = document.querySelector('.location-btn')

let city = ''
searchInput.addEventListener('input',()=>{
    if((searchInput.value).trim() !== ''){
        city = (searchInput.value).trim()
    }
    city = city.toLowerCase()
})

const emptyState = document.getElementById('emptyState')
const loadingState = document.getElementById('loadingState')
const errorState = document.getElementById('errorState')
const weatherContent = document.getElementById('weatherContent')


let recentCities = JSON.parse(localStorage.getItem('recentCities')) || []
let recentSearches = document.getElementById('recentSearches')
let recentList = document.getElementById('recentList')
let clearRecent = document.getElementById('clearRecent')

searchInput.addEventListener('focus', () => {
    if (recentCities.length > 0) {
        console.log(recentCities)
        recentSearches.classList.add('show')
    }
})

document.addEventListener('click', (e) => {
    const isSearchBox = e.target.closest('.search-box')
    const isRecent = e.target.closest('.recent-searches')
    
    if (!isSearchBox && !isRecent) {
        recentSearches.classList.remove('show')
    }
})

clearRecent.addEventListener('click',()=>{
    recentCities = []
    localStorage.removeItem('recentCities')
    recentSearches.classList.remove('show')
})


function addToRecentSearches(cityName){
    recentCities = recentCities.filter(
        city => city.toLowerCase() !== cityName.toLowerCase()
    )

    recentCities.unshift(cityName)
    recentCities = recentCities.slice(0,5)

    localStorage.setItem('recentCities',JSON.stringify(recentCities))

    renderRecentSearches()
}

function returnLi(cityName){
    return `<li class="recent-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24      24">
                <path stroke-linecap="round"        stroke-linejoin="round" stroke-width="2" d="M12     8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>${cityName}</span>
        </li>`
}

function renderRecentSearches(){
    recentList.innerHTML = ''

    if(recentCities.length === 0){
        return
    }
    recentCities.forEach(
        item => {
            recentList.insertAdjacentHTML('beforeend',returnLi(item))
        }
    )
}

document.addEventListener('keydown',(e)=>{
    if(e.key === 'Enter'){
        showLoadingState()
        getWeatherCity(city)
        getForecastDetails(city)
        addToRecentSearches(city)
    }
})

searchBtn.addEventListener('click',()=>{
    showLoadingState()
    getWeatherCity(city)
    getForecastDetails(city)
    addToRecentSearches(city)
})

locationBtn.addEventListener('click',()=>{
    if(!navigator.geolocation){
        showErrorState('Geolocation is not supported by your browser')
        return 
    }

    showLoadingState()

    locationBtn.classList.add('locating')

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude

            getWeatherInfoByCoords(lat, lon)
            getForecastCardInfoByCoords(lat, lon)
        },
        (error) => {
            locationBtn.classList.remove('locating')
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    showErrorState('Location permission denied')
                    break
                case error.POSITION_UNAVAILABLE:
                    showError('Location information unavailable')
                    break
                case error.TIMEOUT:
                    showError('Location request timed out')
                    break
                default:
                    showError('An unknown error occurred')
            }
        }
    )
})

function getWeatherInfoByCoords(lat,lon){
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`

    fetch(url)
        .then( response => {
            if(!response.ok){
                throw new Error ('Unable to fetch the weather')
            }
            return response.json()
        })
        .then( data => {
            showWeatherContent()
            displayInfo(data)
            locationBtn.classList.remove('locating')
        })
        .catch (error => {
            showError(error.message)
            locationBtn.classList.remove('locating')
        })
}

function getForecastCardInfoByCoords(lat,lon){
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`

    fetch(url) 
        .then( response => {
            if(!response.ok){
                throw new Error ('unable to fetch Forecast info')
            }
            return response.json()
        })
        .then( data => {
            showWeatherContent()
            displayForecastCard(data)
            locationBtn.classList.remove('locating')
        }) 
        .catch( error => {
            console.log('Forecast error:', error)
            locationBtn.classList.remove('locating')
        })
}

let cityName = document.getElementById('cityName')
let countryName = document.getElementById('countryName')
let currentdate = document.getElementById('currentDate')

let weatherIcon = document.getElementById('weatherIcon')
let temperature = document.getElementById('temperature')
let tempUnitToggleBtn = document.querySelector('.temp-unit-toggle')
const allUnitBtn = document.querySelectorAll('.unit-btn')

let description = document.getElementById('description')
let feelsLike = document.getElementById('feelsLike')

let humidity = document.getElementById('humidity')
let windSpeed = document.getElementById('windSpeed')
let pressure = document.getElementById('pressure')
let visibility = document.getElementById('visibility')
let uvIndex = document.getElementById('uvIndex')
let cloudCover = document.getElementById('cloudCover')

let sunrise = document.getElementById('sunrise')
let sunset = document.getElementById('sunset')

let celciusValue 
tempUnitToggleBtn.addEventListener('click',(e)=>{
    const btn = e.target.closest('.unit-btn')
    if(!btn) return
    allUnitBtn.forEach(item => item.classList.remove('active'))
    btn.classList.add('active')
    if(btn.id === 'unitF'){
        let C = Number(temperature.dataset.temp)
        let F = Number((C * (9/5) )  + 32)
        temperature.textContent = `${F}`
    }
    if(btn.id === 'unitC'){
        temperature.textContent = `${celciusValue}` 
    }
})
function showLoadingState(){
    loadingState.classList.add('show')
    errorState.classList.remove('show')
    emptyState.classList.add('hide')
    weatherContent.classList.remove('show')
}
function showErrorState(){
    errorState.classList.add('show')
    loadingState.classList.remove('show')
    emptyState.classList.add('hide')
    weatherContent.classList.remove('show')
}
function showWeatherContent(){
    weatherContent.classList.add('show')
    loadingState.classList.remove('show')
    errorState.classList.remove('show')
    emptyState.classList.add('hide')
}


function getWeatherCity(city){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`

    fetch(url)
        .then(response => {
            if(!response.ok){
                throw new Error('city not found')
            }
            return response.json();
        })
        .then(data => {
            displayInfo(data)
            showWeatherContent()
        })
        .catch(error => {
            showErrorState()
        });
}

function displayInfo(data){
    const formatted = new Date().toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).replace("at", " • ");

    cityName.textContent = data.name
    countryName.textContent = data.sys.country
    currentdate.textContent = formatted

    
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
    temperature.textContent = `${Math.floor(data.main.temp - 273.15)}`
    celciusValue = Math.floor(data.main.temp - 273.15)

    temperature.dataset.temp = Math.floor(data.main.temp - 273.15)

    description.textContent = data.weather[0].description
    feelsLike.textContent = `${Math.floor(data.main.feels_like - 273.15)} °C`

    humidity.textContent = `${data.main.humidity} %`;
    windSpeed.textContent = `${Math.floor(data.wind.speed * 3.6)} km/h`
    pressure.textContent = `${data.main.pressure} mb`
    visibility.textContent = `${Math.floor(data.visibility/1000)} km`
    uvIndex.textContent = data.main.uvIndex // left 
    cloudCover.textContent = `${data.clouds.all} %`

    const sunriseTime = new Date(data.sys.sunrise * 1000)
    const sunsetTime = new Date(data.sys.sunset * 1000)

    const sunriseStr = sunriseTime.toLocaleTimeString([],{
        hour: '2-digit',
        minute:'2-digit'
    })

    const sunsetStr = sunsetTime.toLocaleTimeString([],{
        hour: '2-digit',
        minute:'2-digit'
    })

    sunrise.textContent = sunriseStr
    sunset.textContent = sunsetStr

    updateSunArc(data.dt,data.sys.sunrise, data.sys.sunset)

    // addToRecentSearches(data.name)
}

function updateSunArc(currentTime, sunrise, sunset) {
    const arcFill = document.getElementById('arcFill')
    const sunDot = document.getElementById('sunDot')
    
    if (!arcFill || !sunDot) return
    
    const now = Math.floor(Date.now() / 1000)
    const totalDaylight = sunset - sunrise
    const elapsed = now - sunrise
    
    let progress = elapsed / totalDaylight
    
    if (now < sunrise) progress = 0
    else if (now > sunset) progress = 1
    else progress = Math.max(0, Math.min(1, progress))
    
    const offset = 283 - (progress * 283)
    
    // console.log('Arc:', {
    //     progress: Math.round(progress * 100) + '%',
    //     offset: offset
    // })
    
    arcFill.style.strokeDashoffset = offset
    
    const angle = progress * Math.PI
    const x = 10 + (Math.cos(Math.PI - angle) * 40) + 50
    const y = 45 - (Math.sin(angle) * 40)
    
    sunDot.style.left = x + '%'
    sunDot.style.top = y + '%'
}

function getForecastDetails(city){
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
    
    fetch(url)
        .then(response => {
            if(!response.ok){
                throw new Error('forecast not found')
            }
            return response.json()
        })
        
        .then(data => {
            displayForecastCard(data)
        })
    .catch(err => console.error(err.message))
}

const forecastContainer = document.getElementById('forecastContainer')


function groupByDate(data){
    const map = {}

    data.forEach(item => {
        const date = item.dt_txt.split(" ")[0] // data = data.list[0] => data.list[0].dt_txt
        
        if(!map[date]){ // !map[date] checks "is thr any key with value of date or not"
            map[date] = []
            //if not make one key with the value of date & assign it an empty array 
        }

        map[date].push(item)
    })

    return Object.values(map).slice(0,5); // returns an array with 5 from start items || key'name discarded

    // map = {
    //     "2026-01-23": [ /* day 1 items */ ],
    //     "2026-01-24": [ /* day 2 items */ ],
    //     "2026-01-25": [ /* day 3 items */ ]
    // }

    // [
    //     [ /* day 1 items */ ],
    //     [ /* day 2 items */ ],
    //     [ /* day 3 items */ ]
    // ]
}

function createForecastCard(dayItems) {

    const temps = dayItems.map(item => item.main.temp);
    //got the temp of 1 day in 8 objects, dayItems[0].main.temp = @, temps = [dayItems[0-7].main.temp]
    const high = Math.round(Math.max(...temps));
    const low = Math.round(Math.min(...temps));

    const rep =
      dayItems.find(item => item.dt_txt.includes  ("12:00:00")) ||
      dayItems[0];
    const dayName = new Date(rep.dt * 1000)
      .toLocaleDateString("en-US", { weekday: "short" });

    const icon = getWeatherIcon(rep.weather[0].main);

    return `<div class="forecast-card">
        <p class="forecast-day">${dayName}</p>
        <div class="forecast-icon">${icon}</div>
        <div class="forecast-temps">
          <span class="forecast-high">${high}°</span>
          <span class="forecast-low">${low}°</span>
        </div>
      </div>
    `;
}

function displayForecastCard(data){
    forecastContainer.innerHTML = "";

    const groupedDays = groupByDate(data.list); // returns an array with 5 days data

    groupedDays.forEach(dayItems => {
        // const cardHTML = createForecastCard(dayItems);
        forecastContainer.insertAdjacentHTML("beforeend", createForecastCard(dayItems));
    });
}

function getWeatherIcon(main) {
    if (main === "Clear") return "☀️";
    if (main === "Clouds") return "☁️";
    if (main === "Rain") return "🌧️";
    if (main === "Snow") return "❄️";
    return "🌤️";
}


