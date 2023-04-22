function formatDate(timestemp) {
  let now = new Date(timestemp);

  let date = now.getDate();
  let hours = now.getHours();
  hours = (hours < 10 ? "0" : "") + hours;

  let minutes = now.getMinutes();
  minutes = (minutes < 10 ? "0" : "") + minutes;

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  return `${day}, ${date} ${month} <br />${hours}:${minutes}`;
}

function formatDay(timestemp) {
  let date = new Date(timestemp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecastDaily = response.data.daily;

  let forecast = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecastDaily.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">
    <div class="forecast-date">${formatDay(forecastDay.time)}</div>
      <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
        forecastDay.condition.icon
      }.png" alt="" width="42" />
         <div class="forecast-temp">
          <span class="forecast-temp-max"> ${Math.round(
            forecastDay.temperature.maximum
          )}° </span>
          <span class="forecast-temp-min"> ${Math.round(
            forecastDay.temperature.minimum
          )}° </span>
          </div>
     </div>
 `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecast.innerHTML = forecastHTML;
}

function searchCity(city) {
  let apiKey = "cb4f05adt4eec1effo569be9e3f0aecd";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemp);
}

function searchSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#seach-text-input").value;
  searchCity(city);
}

function getForecast(coordinates) {
  let apiKey = "cb4f05adt4eec1effo569be9e3f0aecd";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function showTemp(response) {
  document.querySelector(`#temperatureToday`).innerHTML = Math.round(
    response.data.temperature.current
  );

  document.querySelector(`#humidity`).innerHTML = Math.round(
    response.data.temperature.humidity
  );

  document.querySelector(`#wind`).innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector(`#description`).innerHTML =
    response.data.condition.description;

  document.querySelector("h1").innerHTML = response.data.city;
  document.querySelector("#currentlyDate").innerHTML = formatDate(
    response.data.time * 1000
  );
  document
    .querySelector(`#temperature-today-icon`)
    .setAttribute(
      "src",
      `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
    );

  celsiusTemperatureToday = response.data.temperature.current;

  getForecast(response.data.coordinates);
}

function celsiusClick(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperatureToday");
  celsiusTemperature.classList.add("active");
  fahrenheitTemperatureToday.classList.remove("active");

  temperature.innerHTML = Math.round(celsiusTemperatureToday);
}

function fahrenheitClick(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperatureToday");
  celsiusTemperature.classList.remove("active");
  fahrenheitTemperatureToday.classList.add("active");

  let fahrenheitTemperature = (celsiusTemperatureToday * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemperature);
}

let celsiusTemperatureToday = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchSubmit);

let celsiusTemperature = document.querySelector("#celsius-link");
celsiusTemperature.addEventListener("click", celsiusClick);

let fahrenheitTemperatureToday = document.querySelector("#fahrenheit-link");
fahrenheitTemperatureToday.addEventListener("click", fahrenheitClick);

searchCity("Odessa");