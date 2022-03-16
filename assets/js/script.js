const userFormEl = $('#user-form');
const cityInputEl = $('#cityName');
const cityContainerEl = $('#city-weather-container');
const citySearchTerm = $('#city-search-term')

const fiveDayContainerEl = $('#five-day-container')
const fiveDayTitleEl = $('.container')

const cityHistoryContainerEl = $('#city-history')

const APIKey = `fac3e5205c2a5a41a3544c2e4efad7f2`;

function formSubmitHandler(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    let cityName = cityInputEl.val().trim();
    cityName = cityName.split(' ').join('+');

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
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${APIKey}`;


    // make a get request to url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok){
            response.json().then(function(data){
                const lon = data.coord.lon; 
                const lat = data.coord.lat;
                getOneCall(data, lon, lat);
                // save city to local storage
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    }).catch(function(error){
        alert('Unable to connect to OpenWeather Servers')
    })
};

function getOneCall(current, lon, lat) {
    // format the OpenWeather One Call Api URL
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&APPID=${APIKey}`;
    
    // make a get request to url
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok){
                response.json().then(function(oneCallData){
                    displayWeather(current, oneCallData)
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        }).catch(function(error){
            alert('Unable to connect to OpenWeather One Call Servers')
    })
};

function displayWeather(data, oneCallData) {
    // check if the api returned any weather data
    if (data.length === 0) {
        alert('City not found');
        return;
    };

    // target the name of the city from the api object
    const searchTerm = data.name;
    // target the icon id from the api object
    const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    // change the text to show the city name and current date and append the icon image
    citySearchTerm.text(`${searchTerm} (${moment().format('l')})`).append(`<img src="${weatherIcon}"/>`);
    // target the temp key in the weather object from the API
    const temp = `${data.main.temp}°F`;
    // target wind speed key in weather object
    const wind = `${data.wind.speed} MPH`;
    // target humidity
    const humid = `${data.main.humidity} %`;
    
    // target UV index
    let uVIndex = oneCallData.current.uvi;
    if (uVIndex <= 2) {
        uVIndex = `<p style="color:green;font-weight: bold;">UV Index: ${uVIndex}</p>`;
    } else if (uVIndex > 2 && uVIndex <= 7) {
        uVIndex = `<p style="color:orange;font-weight: bold;">UV Index: ${uVIndex}</p>`;
    } else {
        uVIndex = `<p style="color:red;font-weight: bold;">UV Index: ${uVIndex}</p>`;
    }

    cityContainerEl
        .append(`<p>Temp: ${temp}</p>`)
        .append(`<p>Wind: ${wind}</p>`)
        .append(`<p>Humidity: ${humid}</p>`)
        .append(uVIndex);

    displayFiveDay(oneCallData);
};

function displayFiveDay(oneCallData) {
    fiveDayContainerEl.empty();
    for (i = 0; i < 5; i++){
        
        let cardDate = moment().add(i+1,'days');
        cardDate = cardDate.format('l');
        let forcastCard = $('<div>').addClass('col-2').css({'background':'#132e4d','margin':'0 2px'}).text(cardDate);
        let forcastIcon = `https://openweathermap.org/img/wn/${oneCallData.daily[i].weather[0].icon}.png`;
        let forcastTemp = `<p>Temp: ${oneCallData.daily[i].temp.day}°F</p>`;
        let forcastWind = `<p>Wind: ${oneCallData.daily[i].wind_speed} MPH</p>`;
        let forcastHumid = `<p>Humidity: ${oneCallData.daily[i].humidity} %</p>`;;
        forcastCard.append(`<img src="${forcastIcon}"/>`)
            .append(forcastTemp)
            .append(forcastWind)
            .append(forcastHumid);
        fiveDayContainerEl.append(forcastCard);
    }
};

// func loadHistory {look into local storage and create a button for every city saved}
// event listener for buttons that takes their id city value : btn element it into the formSubmitHandler
// func saveHistory every time getCityWeather(city) is successful

userFormEl.on('submit', formSubmitHandler);