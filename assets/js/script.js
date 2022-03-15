const userFormEl = $('#user-form');
const cityInputEl = $('#cityName');
const cityContainerEl = $('#city-weather-container');
const citySearchTerm = $('#city-search-term')

const popCityBtnEl = $('#popular-cities')

const APIKey = `fac3e5205c2a5a41a3544c2e4efad7f2`;

function formSubmitHandler(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    console.log(cityInputEl.val());
    let cityName = cityInputEl.val().trim();
    cityName = cityName.split(' ').join('+');
    console.log(cityName);

    if (cityName) {
        getCityWeather(cityName);
        // clear old content
        cityContainerEl.text('');
        cityInputEl.text('');
    } else {
        alert('Please enter a city name')
    }
};

function getCityWeather(city) {
    // format the OpenWeather API URL
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${APIKey}`;
    console.log(apiUrl);

    // make a get request to url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok){
            console.log(response);
            response.json().then(function(data){
                console.log(data);
                displayWeather(data, city);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    }).catch(function(error){
        alert('Unable to connect to OpenWeather Servers')
    })
};

function displayWeather(weather, searchTerm) {
    
};

userFormEl.on('submit', formSubmitHandler);