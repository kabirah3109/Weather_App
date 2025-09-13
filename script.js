const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherInfo = document.getElementById("weatherInfo");

// Search Button
searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather();
});

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    weatherInfo.innerHTML = `<p style="color: red;">Please enter a city name</p>`;
    return;
  }

  try {
    const apiKey = "6eb33e49deb748a2b6a190706240112"; // ← Api working key
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
    );

    if (response.status === 404) {
      throw new Error("City not found. Please check spelling.");
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();

    // Extract location & weather data
    const { name, region, country } = data.location;
    const { temp_c, condition, humidity, wind_kph, feelslike_c } = data.current;

    // Display in app
    weatherInfo.innerHTML = `
            <div class="weather-card">
                <h2>${name}, ${region}, ${country}</h2>
                <div class="weather-icon">
                    ${getWeatherIcon(condition.text)}
                </div>
                <p><strong>Temperature:</strong> ${temp_c}°C (Feels like ${feelslike_c}°C)</p>
                <p><strong>Condition:</strong> ${condition.text}</p>
                <p><strong>Humidity:</strong> ${humidity}%</p>
                <p><strong>Wind:</strong> ${wind_kph} km/h</p>
            </div>
        `;
  } catch (error) {
    weatherInfo.innerHTML = `
            <div class="weather-card">
                <p style="color: red;">${error.message}</p>
            </div>
        `;
    console.error("Weather API Error:", error);
  }
}

function showLoading() {
  weatherInfo.innerHTML = `<div class="loading">🌤️ Fetching weather...</div>`;
}
function getWeatherIcon(weatherText) {
  const lower = weatherText.toLowerCase();
  if (lower.includes("sunny")) return "☀️";
  if (lower.includes("cloud") || lower.includes("overcast")) return "☁️";
  if (lower.includes("rain") || lower.includes("shower")) return "🌧️";
  if (lower.includes("thunder")) return "⛈️";
  if (lower.includes("snow")) return "❄️";
  if (lower.includes("mist") || lower.includes("fog")) return "🌫️";
  return "🌤️";
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
