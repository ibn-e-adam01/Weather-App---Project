let Api_Key;
let Input = document.querySelector("input");
let Btn = document.querySelector("button");
let city;
let apiKey;
let lat;
let lon;

Btn.addEventListener("click", async () => {
    // making it hidden again is important as style has been changed, it wont get back after catch finishes, so we have to make it hide again, otherwise our sweet user will hit trauma that why it is showing Invalid City Name and weather data also and even the city name is correct!
    // Also, if we put this line of code at the end of this event, it will take a brief moment to hide when there even data is shown on site!
    document.querySelector(".remark p").style.visibility = "hidden";
    // When we click, while fetching data, these lines will give assurance to user that data is fetching and keep you eyes on, otherwise they'll sleep!
    document.querySelector("#temp").innerText = "Loading..."; 
    document.querySelector("#hum").innerText = "Loading...";
    document.querySelector("#pr").innerText = "Loading...";
    document.querySelector("#aqi").innerText = "Loading...";
    city = Input.value;
    
    // whatever we will write in input and then click this button, it will store in city var and then value of city var will lead to urlGeo as name=Input.value
try{
    let urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
    // Here, we are trying to recieve(get) data(in json format) and then converting it into JS Object and from that object we can access any property/sub-object!
    let data = await (await fetch(urlGeo)).json();
    console.log(data);
    // In data, there is an object named results where at 0th index, there is a key named latitude and longitude containing specific values for input value.
    lat = data.results[0].latitude;
    lon = data.results[0].longitude;
    console.log(lat);
    console.log(lon);
    // API_KEY is important as they are alphanumeric virtual password or access keys to the external API we are using and are provided by the API provider and without these, we cant access any API. They have call validity for a specific time usually when we use them as free!
    Api_Key = `e61630a4483b9f31ec25983d81d1419a`;
    // Now, we just mined out the latitude and longitude values for specific input values from above 1st API. And now need to store those values in any vars and then keep those vars in next API to get access to those latitude and longitude of input value!
    let WeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Api_Key}`;
    let response = await(await fetch(WeatherAPI)).json();
    console.log(response);
    // Here, we are taking temp, humidity, pressure and wind speed data from JS Object(response) from the sub-object of response(main!)
    let temp = response.main.temp;
    let hum = response.main.humidity;
    let Pressure = response.main.pressure;
    let windSpeed = response.wind.speed;
    // Here, we are taking description of type of weather like overcast clouds, clear etc... and then showing it on screen for specific locations
    let weatherName = response.weather[0].description;
    // Here, we are showing those type of weather on screen!
    document.querySelector(".w").innerText = `${weatherName}`;
    // Here, we are taking icon code from response data and then using it in url of weather icons, which directly provides us images or icons of different type of weather, based on icon codes like 04d(overcast clouds) etc...
    let weatherIcon = response.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    // Here, we are showing those weather icons for different locations, just to make website look good enough!
    document.querySelector("#icon").src = iconUrl;
    // converting kelvin to celsius here as JS Object has kelvin temp value! and then Math.trunc() removes the decimal values!
    document.querySelector("#temp").innerText = `${Math.trunc(temp - 273.15)}°C`; 
    document.querySelector("#hum").innerText = `${Math.trunc(hum)}%`;
    document.querySelector("#pr").innerText = `${Math.trunc(Pressure)}hPa`;
    //Here, we took wind direction degree data
    let windDir = response.wind.deg;
    // took an array of direction strings to use them later!
    const directions = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
    // Here, converting wind deg to deg with direction names as then we stored whatever index comes for every input value, we need direction string in above array, on that index, in x var and then showed that direction name with our air speed below!
    const  index = Math.trunc((windDir/45)%8);
    const x = directions[index];
    // converting windSpeed(knot per second) into m/s below!
    document.querySelector("#aqi").innerText = `${Math.trunc(windSpeed*0.44704)}m/s ${x}`;

}
    // I did error handling with try-catch here, just to give ease to the user that he might stare into his screen and waiting for weather data for non-existing city, so we tell him,"Brother! Go home and Sleep Well, You have dyslexia!"
 catch(error){
        document.querySelector(".remark p").style.visibility = "visible";
        return;
    }
});
