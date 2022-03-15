const APIKey = `fac3e5205c2a5a41a3544c2e4efad7f2`;

let cityName= `San Francisco`
cityName = cityName.split(' ').join('+');
// console.log(cityName);

let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${APIKey}`;
// console.log(apiUrl);

fetch(apiUrl).then(function(response) {
    if (response.ok){
        console.log(response);
        response.json().then(function(data){
            console.log(data);
            // displayWeather(data, city);
        });
    } else {
        alert('Error: ' + response.statusText);
    }
}).catch(function(error){
    alert('Unable to connect to OpenWeather Servers')
})