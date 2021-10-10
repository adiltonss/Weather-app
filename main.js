window.onload = getWeatherByIp();
document.getElementById('city-input').focus();
//http://api.weatherapi.com/v1/current.json?key=3700919ad4d4476284e191312210710&q=London&aqi=no por nome
/* https://ipgeolocation.abstractapi.com/v1/?api_key=c777bcc6e66d4ed8878342e3b4ba3427 */

//onload, will the take weather info from the user location
function getWeatherByIp(){
    fetch("https://ipgeolocation.abstractapi.com/v1/?api_key=c777bcc6e66d4ed8878342e3b4ba3427")
    .then(response => handleErrors(response))
    .then(data => getWeather(data.city))
}

//just to return the json, the render function will notify the error
function handleErrors(response) {
    return response.json();
}

//will the take weather info through the input and the click
function getWeather(city){
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=3700919ad4d4476284e191312210710&q=${city}&days=5&aqi=no&alerts=no`)
    .then(response => handleErrors(response))
    .then(obj => render(obj))
}

//calls the fetch
document.querySelector('.btn-primary').addEventListener('click', (e)=>{
    e.preventDefault();
    let cityName = document.getElementById('city-input').value;
    if(cityName === ''){
        return alert("You must search a valid city name.")
    }
    getWeather(cityName);
    document.getElementById('city-input').value = '';
    document.getElementById('city-input').focus();
})


function render(weather){
    if(weather.error){
       return alert(weather.error.message);
    }
    let cityName = document.querySelector('.cityName');
    let currentTemp = document.querySelector('.currentTemp');
    let remainInfo = document.querySelector('.remainingInfo');
    let daysDisplay = document.querySelector(".next-days");
    cityName.innerHTML = '';
    currentTemp.innerHTML = '';
    remainInfo.innerHTML = '';
    daysDisplay.innerHTML = '';
    let apiDate = weather.location.localtime.split(' ');
    let currentDay = apiDate[0].split('-').reverse().join('/');
    let hourNow = apiDate[1];

    cityName.innerHTML = `${weather.location.name} - ${weather.location.region} - ${weather.location.country}, ${hourNow} - ${currentDay}`
    currentTemp.innerHTML = 
    `
        <img class="condition" src="${weather.current.condition.icon}" alt="Condition icon">
        <div class="temp">${parseInt(weather.current.temp_c)}<span>&#8451;</span></div>
        
        <div class="maxTemp"><i class="fas fa-arrow-up"></i>Max ${parseInt(weather.forecast.forecastday[0].day.maxtemp_c)}<span>&#8451;</span></div>

        <div class="minTemp">Min ${parseInt(weather.forecast.forecastday[0].day.avgtemp_c)}<span>&#8451;</span><i class="fas fa-arrow-down"></i></div>
    `;
    remainInfo.innerHTML = 
    `
        <p>Rain: ${parseInt(weather.current.precip_mm)}%</p>
        <p>Air Humidity: ${parseInt(weather.current.humidity)}%</p>
        <p>${weather.current.condition.text}</p>

    `
    let previousDays = weather.forecast.forecastday;
    for(let i = 1; i < previousDays.length; i++){
                let container = document.createElement('div');
        container.classList = 'day';    
        container.innerHTML = 
        `
            <div class="day-number">${previousDays[i].date.split('-').reverse().join('/')}</div>
            <div class="day-temp">
                <img  class="next-day-cond" src="${previousDays[i].day.condition.icon}" alt="">
                <div class="next-day-temp">${parseInt(previousDays[i].day.maxtemp_c)}<span>&#8451;</span><i class="fas fa-arrow-up"></i></div>
                <div class="min">${parseInt(previousDays[i].day.avgtemp_c)}<span>&#8451;</span><i class="fas fa-arrow-down"></i></div>
            </div>
            <div class="type">${previousDays[i].day.condition.text}</div>
        `
        daysDisplay.appendChild(container);
    }
}