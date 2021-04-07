const input = document.getElementById('cityName');
const matchList = document.getElementById('match-list');
const key = 'cb178c0d0bb2676ef9582df2d4edc2d0';
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const array = [{
  icon: "iconOne",
  day: "first-day",
  weather: "first-weather"
}, {
  icon: "iconTwo",
  day: "second-day",
  weather: "second-weather"
}, {
  icon: "iconThree",
  day: "third-day",
  weather: "third-weather"
}, {
  icon: "iconFour",
  day: "fourth-day",
  weather: "fourth-weather"
}, {
  icon: "iconFive",
  day: "fifth-day",
  weather: "fifth-weather"
}];

// function initMap(){
//   let autocomplete = new google.maps.places.Autocomplete(input, { types: ['(cities)']});
// }

window.onload = function () {
  fiveDayForecast("Warsaw");
};

function getInputValue() {
  const cityName = input.value;
  fiveDayForecast(cityName);
}

function fiveDayForecast(cityName) {
  link = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&cnt=37&units=metric&apikey=' + key;
  let request = new XMLHttpRequest();
  request.open('GET', link, true);
  request.onload = function () {
    let obj = JSON.parse(this.response);
    console.log(obj);
    if (request.status >= 200 && request.status < 400) {
      const mainForecast = [obj.list[0].main.temp,
        obj.list[0].weather[0].main,
        obj.list[0].main.humidity,
        obj.list[0].wind.speed,
        obj.city.name,
        obj.list[0].weather[0].icon,
        obj.city.sunset,
        obj.city.sunrise,
        obj.city.timezone,
        obj.list[0].dt,
        obj.list[0].weather[0].description
      ]

      const oneDayIcons = [obj.list[7].weather[0].icon, obj.list[14].weather[0].icon, obj.list[21].weather[0].icon, obj.list[28].weather[0].icon, obj.list[35].weather[0].icon];

      const oneDayAccDescriptions = [obj.list[7].weather[0].description, obj.list[14].weather[0].description, obj.list[21].weather[0].description, obj.list[28].weather[0].description, obj.list[35].weather[0].description]

      const oneDayDescriptions = [obj.list[7].weather[0].main, obj.list[14].weather[0].main, obj.list[21].weather[0].main, obj.list[28].weather[0].main, obj.list[35].weather[0].main]

      console.log(oneDayDescriptions);

      const oneDayNames = [obj.list[7].dt, obj.list[14].dt, obj.list[21].dt, obj.list[28].dt, obj.list[35].dt]
      const oneDayTemps = [obj.list[7].main.temp, obj.list[14].main.temp, obj.list[21].main.temp, obj.list[28].main.temp, obj.list[35].main.temp];

      fillMainInfo(mainForecast[0], mainForecast[1], mainForecast[2], mainForecast[3], mainForecast[4], mainForecast[5], mainForecast[6], mainForecast[7], mainForecast[8], mainForecast[9], mainForecast[10]);
      fillFiveDayForecast(oneDayIcons, oneDayNames, oneDayTemps,oneDayAccDescriptions, oneDayDescriptions);
    } else {
      alert("Can't find such city. Please try again");
    }
  }
  request.send();
}

function fillFiveDayForecast(iconArray, nameArray, tempArray, accDesc, desc) {
  for (let element = 0; element < array.length; element++) {
    addOneDayForecast(array[element].icon, array[element].day, array[element].weather, days, iconArray[element], nameArray[element], tempArray[element],accDesc[element],desc[element]);
  }
}
/* Set value for main forecast */
const setMainTemperature = temp => {
  const a = Math.round(temp);
  const temperature = document.getElementById("temp");
  const text = document.createTextNode(`\u00A0${a}°`);
  temperature.appendChild(text);
}

const setMainDescription = desc => {
  const description = document.getElementById("description");
  const text = document.createTextNode(`${desc}\u00A0`);
  description.appendChild(text);
}

const setMainHumidity = humidity => {
  const hum = document.getElementById("humidit");
  const text = document.createTextNode(humidity + "%");
  hum.appendChild(text);
}

const setMainWindSpeed = wind => {
  const windRounded = Math.round(wind * 10) / 10;
  const winds = document.getElementById("winds");
  const text = document.createTextNode(windRounded + " km/h");
  winds.appendChild(text);
}

const setMainCityName = city => {
  const town = document.getElementById("city");
  const text = document.createTextNode(city);
  town.appendChild(text)
}



const setMainIcon = (desc, accDesc, sunset, sunrise, date) => {
  const img = document.createElement('img');
  img.alt = `Animated icon presenting ${accDesc}`;
  img.classList.add("icon-main");
  date < sunset && date > sunrise ? img.src = getIcon(desc, accDesc, timeOfDay = "day") : img.src = getIcon(desc, accDesc,timeOfDay = "night");
  document.getElementById("icon").appendChild(img);
}

function getIcon(desc, accDesc, timeOfDay) {
  switch (desc) {
    case "Thunderstrom":
      return "../animations/Thunderstorm.svg";
    case "Drizzle":
      return "../animations/Drizzle.svg";
    case "Mist" :
    case "Smoke" :
    case "Haze" :
    case "Dust" :
    case "Fog" :
    case "Sand" :
    case "Dust" :
    case "Ash" :
    case "Squall" :
    case "Tornado" :
      return "../animations/cloudy.svg";
    case "Clear":
      return `../animations/${timeOfDay}.svg`;
    case "Clouds":
      return `../animations/${accDesc}-${timeOfDay}.svg`
    case "Rain" :
      return `../animations/rain-${timeOfDay}.svg`;
    case "Snow" :
      return `../animations/snow-${timeOfDay}.svg`;
}
}

const setMainSunset = (sunsetTime, timezone) => {
  const sunset = document.getElementById("sdown");
  const date = new Date(sunsetTime * 1000);
  const hours = date.getHours() + Math.round(timezone / 3600) - 1;
  if (hours > 24) {
    hours = hours - 24;
  }
  const minutes = "0" + date.getMinutes()
  const text = document.createTextNode(hours + ':' + minutes.substr(-2));
  sunset.appendChild(text);
}

const setMainSunrise = (sunriseTime, timezone) => {
  let sunrise = document.getElementById("sup");
  let date = new Date(sunriseTime * 1000);
  let hours = date.getHours() + Math.round(timezone / 3600) - 1;
  if (hours > 24) {
    hours = hours - 24;
  }
  const minutes = "0" + date.getMinutes();
  const text = document.createTextNode(hours + ':' + minutes.substr(-2));
  sunrise.appendChild(text);
}

const prepareMainInfos = () => {
  clear('temp');
  clear('description');
  clear('city');
  clear('winds');
  clear('humidit');
  clear('icon');
  clear('sup');
  clear('sdown');
}

function fillMainInfo(temp, desc, humidity, wind, city, icon, sunsetTime, sunriseTime, timezone, date, accurateDescription) {
  prepareMainInfos();
  setMainTemperature(temp);
  setMainDescription(desc);
  setMainHumidity(humidity);
  setMainWindSpeed(wind);
  setMainCityName(city);
  setMainIcon(desc, accurateDescription, sunsetTime, sunriseTime, date);
  setMainSunset(sunsetTime, timezone);
  setMainSunrise(sunriseTime, timezone);
}
/* -------------------------------*/



function addOneDayForecast(parentID, dayID, weatherID, daysArray, icon, date, temp, accDesc, desc) {
  const temperature = document.getElementById(weatherID);
  const name = document.getElementById(dayID);

  clear(dayID);
  clear(weatherID);
  clear(parentID);

  console.log(accDesc,desc);
  const img = document.createElement('img');
  img.alt = `Animated icon presenting weather for ${dayID}`;
  img.src = getIcon(desc,accDesc,"day");
  img.style.height = '100px';
  img.style.width = '100px';
  document.getElementById(parentID).appendChild(img);
  let d = new Date(date * 1000);
  const dayName = daysArray[d.getDay()];
  const textDayName = document.createTextNode(dayName);
  name.appendChild(textDayName);
  const a = Math.round(temp);
  const textDegrees = document.createTextNode(a + "°");
  temperature.appendChild(textDegrees);
}

function clear(elementID) {
  document.getElementById(elementID).innerHTML = "";
}

const showTime = () => {
  const date = new Date();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  let session = "AM";
  if (h == 0) {
    h = 12;
  }
  if (h > 12) {
    h = h - 12;
    session = "PM";
  }
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;
  const time = h + ":" + m + ":" + s + " " + session;
  document.getElementById("MyClockDisplay").innerText = time;
  document.getElementById("MyClockDisplay").textContent = time;
  setTimeout(showTime, 1000);
}

showTime();
