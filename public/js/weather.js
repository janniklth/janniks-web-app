// loaded message
console.log('weather.js loaded');


// Event listener for the search button
document.getElementById('searchWeatherButton').addEventListener('click', function() {
    // log message
    console.log('searchWeatherButton clicked');

    // call api and display weather data
    getWeatherData('Berlin').then(data => {
        showWeatherData(data);
    });
});

// Function to fetch weather data from OpenWeatherMapAPI
function getWeatherData(city) {
    const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=48.7823&longitude=9.177&current=temperature_2m,apparent_temperature,rain,weathercode,windspeed_10m&hourly=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Europe%2FBerlin";

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('There was a problem fetching the weather data:', error);
        });
}

// Function to get the current weather data
function showCurrentWeatherData(data) {
    // get elements for current weather
    const currentTemperatureElement = document.getElementById('currentTemperature');
    const currentRainChanceElement = document.getElementById('currentRainChance');

    // set current weather
    currentTemperatureElement.textContent = `${data.current.temperature_2m}°C`;
    currentRainChanceElement.textContent = `Chance of Rain: ${data.current.rain} %`;

    // log current weather
    console.log(`Current Temperature: ${data.current.temperature_2m}°C`);
    console.log(`Chance of Rain: ${data.current.rain} %`);
}

// Function to get the hourly weather data
function showHourlyWeatherData(data) {

}

// Function to get the daily (7 days) weather data
function showDailyWeatherData(data) {
    // get the elements for every day
    const day1Element = document.getElementById('day1');
    const day2Element = document.getElementById('day2');
    const day3Element = document.getElementById('day3');
    const day4Element = document.getElementById('day4');
    const day5Element = document.getElementById('day5');
    const day6Element = document.getElementById('day6');
    const day7Element = document.getElementById('day7');

    // show temperature for every day
    day1Element.querySelector('h4').textContent = `${data.daily.temperature_2m_max[0]}°C / ${data.daily.temperature_2m_min[0]}°C`;
    day2Element.querySelector('h4').textContent = `${data.daily.temperature_2m_max[1]}°C / ${data.daily.temperature_2m_min[1]}°C`;
    day3Element.querySelector('h4').textContent = `${data.daily.temperature_2m_max[2]}°C / ${data.daily.temperature_2m_min[2]}°C`;
    day4Element.querySelector('h4').textContent = `${data.daily.temperature_2m_max[3]}°C / ${data.daily.temperature_2m_min[3]}°C`;
    day5Element.querySelector('h4').textContent = `${data.daily.temperature_2m_max[4]}°C / ${data.daily.temperature_2m_min[4]}°C`;
    day6Element.querySelector('h4').textContent = `${data.daily.temperature_2m_max[5]}°C / ${data.daily.temperature_2m_min[5]}°C`;
    day7Element.querySelector('h4').textContent = `${data.daily.temperature_2m_max[6]}°C / ${data.daily.temperature_2m_min[6]}°C`;
}

// Function to display weather data on the webpage
function showWeatherData(data) {
    // show current weather
    showCurrentWeatherData(data);

    // show hourly weather
    showHourlyWeatherData(data);

    // show daily weather
    showDailyWeatherData(data);

    console.log(data);
}


// Function to convert weathercode to weather icon
function getWeatherIcon(weathercode) {

}