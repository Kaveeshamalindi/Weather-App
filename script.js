const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const rain = document.getElementById("rain");

const loading = document.getElementById("loading");
const error = document.getElementById("error");

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {
        error.textContent = "Please enter a city name.";
        return;
    }

    getWeather(city);
});

async function getWeather(city) {

    try {

        loading.style.display = "block";
        error.textContent = "";

        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            throw new Error("City not found.");
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        await getWeatherData(
            location.name,
            latitude,
            longitude
        );

    } catch (err) {

        error.textContent = err.message;

    } finally {

        loading.style.display = "none";

    }
}

async function getWeatherData(city, latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
        `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to get weather data.");
    }

    const data = await response.json();

    displayWeather(city, data);
}

function displayWeather(city, data) {

    cityName.textContent = city;

    temperature.textContent =
        Math.round(data.current.temperature_2m);

    humidity.textContent =
        data.current.relative_humidity_2m + "%";

    wind.textContent =
        data.current.wind_speed_10m + " km/h";

    rain.textContent =
        data.current.precipitation + " mm";

    condition.textContent =
        getWeatherCondition(data.current.weather_code);
}

function getWeatherCondition(code) {

    if (code === 0) {
        return "☀️ Clear sky";
    }

    if (code >= 1 && code <= 3) {
        return "🌤️ Partly cloudy";
    }

    if (code >= 45 && code <= 48) {
        return "🌫️ Foggy";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️ Rainy";
    }

    if (code >= 71 && code <= 77) {
        return "❄️ Snowy";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️ Rain showers";
    }

    if (code >= 95) {
        return "⛈️ Thunderstorm";
    }

    return "🌥️ Unknown";
}