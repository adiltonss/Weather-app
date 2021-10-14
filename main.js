const config = {
    ipObj: "c777bcc6e66d4ed8878342e3b4ba3427",
    weather: "3700919ad4d4476284e191312210710"
}

let backgrounds = [
    {
        hour:00,
        bgColor: "#00000c"
    },
    {
        hour:01,
        bgColor:"linear-gradient(to bottom, #020111 85%,#191621 100%)"
    },
    {
        hour:02,
        bgColor:"linear-gradient(to bottom, #020111 60%,#20202c 100%)"
    },
    {
        hour:03,
        bgColor:"linear-gradient(to bottom, #020111 10%,#3a3a52 100%)"
    },
    {
        hour:04,
        bgColor:"linear-gradient(to bottom, #20202c 0%,#515175 100%)"
    },
    {
        hour:05,
        bgColor:"linear-gradient(to bottom, #40405c 0%,#6f71aa 80%,#8a76ab 100%)"
    },
    {
        hour:06,
        bgColor:"linear-gradient(to bottom, #4a4969 0%,#7072ab 50%,#cd82a0 100%)"
    },
    {
        hour:07,
        bgColor:"linear-gradient(to bottom, #757abf 0%,#8583be 60%,#eab0d1 100%)"
    },
    {
        hour:08,
        bgColor:"linear-gradient(to bottom, #82addb 0%,#ebb2b1 100%)"
    },
    {
        hour:09,
        bgColor:"linear-gradient(to bottom, #94c5f8 1%,#a6e6ff 70%,#b1b5ea 100%)"
    },
    {
        hour:10,
        bgColor:"linear-gradient(to bottom, #b7eaff 0%,#94dfff 100%)"
    },
    {
        hour:11,
        bgColor:"linear-gradient(to bottom, #9be2fe 0%,#67d1fb 100%)"
    },
    {
        hour:12,
        bgColor:"linear-gradient(to bottom, #90dffe 0%,#38a3d1 100%)"
    },
    {
        hour:13,
        bgColor:"linear-gradient(to bottom, #57c1eb 0%,#246fa8 100%)"
    },
    {
        hour:14,
        bgColor:"linear-gradient(to bottom, #2d91c2 0%,#1e528e 100%)"
    },
    {
        hour:15,
        bgColor:"linear-gradient(to bottom, #2473ab 0%,#1e528e 70%,#5b7983 100%)"
    },
    {
        hour:16,
        bgColor:"linear-gradient(to bottom, #1e528e 0%,#265889 50%,#9da671 100%)"
    },
    {
        hour:17,
        bgColor:"linear-gradient(to bottom, #1e528e 0%,#728a7c 50%,#e9ce5d 100%)"
    },
    {
        hour:18,
        bgColor:"linear-gradient(to bottom, #154277 0%,#576e71 30%,#e1c45e 70%,#b26339 100%)"
    },
    {
        hour:19,
        bgColor:"linear-gradient(to bottom, #163C52 0%,#4F4F47 30%,#C5752D 60%,#B7490F 80%, #2F1107 100%)"
    },
    {
        hour:20,
        bgColor:"linear-gradient(to bottom, #071B26 0%,#071B26 30%,#0A2342 80%, #283E51 100%)"
    },
    {
        hour:21,
        bgColor:"linear-gradient(to bottom, #010A10 30%,#041428 70%,#283e51 100%)"
    },
    {
        hour:22,
        bgColor:"linear-gradient(to bottom, #021226 50%,#223648 100%)"
    },
    {
        hour:23,
        bgColor:"linear-gradient(to bottom, #152432 80%,#021226 100%)"
    }
]

window.onload = function(){
    createRequests(`https://ipgeolocation.abstractapi.com/v1/?api_key=${config.ipObj}`, getWeather); 
    document.getElementById('city-input').focus();
    let date = new Date();
    let hour = date.getHours();
    changeBg(hour)
}

function createRequests(url, callback){
    fetch(url)
    .then(response => response.json())
    .then(data => callback(data))
}

//calls the fetch using the city name
function getWeather(data){
    createRequests(`https://api.weatherapi.com/v1/forecast.json?key=${config.weather}&q=${data.city}&days=5&aqi=no&alerts=no`, render);
}

//will the take weather info through the input and the click
document.querySelector('.btn-primary').addEventListener('click', (e)=>{
    e.preventDefault();
    let cityName = document.getElementById('city-input').value;
    if(cityName === ''){
        return alert("You must search a valid city name.")
    }
    createRequests(`https://api.weatherapi.com/v1/forecast.json?key=${config.weather}&q=${cityName}&days=5&aqi=no&alerts=no`, render);
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
    changeBg(hourNow.split(":")[0]);
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

function changeBg(hourTime){
    let body = document.querySelector('body');
    body.style.background = backgrounds[hourTime].bgColor;      
    body.classList += ' changeBg';
}

document.querySelector('body').addEventListener("animationend", ()=>{
    document.querySelector('body').classList = '';
})