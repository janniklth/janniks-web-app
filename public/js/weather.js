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
    const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=48.7823&longitude=9.177&current=temperature_2m&hourly=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Europe%2FBerlin";

    return fetch(meteoMaticsUrl)
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

    // set current weather
    currentTemperatureElement.textContent = `${data.current.temperature_2m}°C`;
}

// Function to get the hourly weather data
function showHourlyWeatherData(data) {

}

// Function to get the daily (7 days) weather data
function showDailyWeatherData(data) {

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