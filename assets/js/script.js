//If there is not yet a search history, create variable for search history, otherwise, store user's history in variable, searchHistory
if (localStorage.getItem("weathersearchhistory") === null) {
    var searchHistory = [];
} else {
    var searchHistory = JSON.parse(localStorage.getItem("weathersearchhistory"));
}

//Takes temp in kelvin returns temp in fahrenheit
function ktof(k) {
    return ((k - 273.15) * (9 / 5)) + 32;
}

//Takes temp in kelvin returns temp in celsius
function ktoc(k) {
    return (k - 273.15);
}

//Takes string and stores in searchHistory[]
//and stringify it and store in localStorage key "weathersearchhistory"
function storeHistory(searchItem) {
    searchHistory.push(searchItem);
    localStorage.setItem("weathersearchhistory", JSON.stringify(searchHistory));
}

//Create main container
var container = $("<div>").addClass("container-fluid main-container");
$(document.body).append(container);

//Create header
var header = $("<div>").addClass("row no-gutters w-100 header");
container.append(header.append($("<h1>").text("Weather Dashboard")));

//Create main
var main = $("<div>").addClass("row no-gutters w-100 main");
container.append(main);

//Create page elements
var searchCol = $("<div>").addClass("col-12 col-md-6 p-0 p-sm-1 p-md-2 p-lg-5 search-col");
var searchBoxRow = $("<div>").addClass("row no-gutters search-box-row");
var searchForm = $("<form>").addClass("search-form w-100 h-100 d-flex align-items-center");
var searchBox = $("<input>").addClass("input w-100").attr({ 'type': 'text', 'name': 'searchbox', 'placeholder': 'Enter city name here' });
var searchButton = $("<button>").addClass("btn btn-primary search-btn");
var currentLocationRow = $("<div>").addClass("row no-gutters current-location-row");
var currentLocationCol = $("<div>").addClass("col-12 py-2 px-1 current-location-col").text("Use Current Location");
var searchHistoryRow = $("<div>").addClass("row no-gutters search-history-row");


var weatherCol = $("<div>").addClass("col-12 col-md-6 p-0 p-sm-1 p-md-2 p-lg-5 weather-col");
var weatherRow = $("<div>").addClass("row no-gutters current-weather-row");
var currentWeatherCol = $("<div>").addClass("col-12 mb-1 p-3 current-weather-col")
var cityTitle = $("<h1>").addClass("city-title display-4")
var tempDisplay = $("<p>").addClass("temp-display");
var humidityDisplay = $("<p>").addClass("humidity-display");
var windSpeedDisplay = $("<p>").addClass("wind-speed-display");
var uvIndexDisplay = $("<p>").addClass("uv-index-display");
var currentWeatherIcon = $("<img>").addClass("current-weather-icon");

var fiveDayForecastCol = $("<div>").addClass("col-12 five-day-forecast-col")
var fiveDayForecastRow = $("<div>").addClass("row no-gutters five-day-forecast-row");
var fiveDayForecastTitleCol = $("<div>").addClass("col-12 forecast-block");

if (localStorage.getItem("weathersearchhistory") === null) {
    weatherCol.hide();
}

console.log(localStorage.getItem("weathersearchhistory"));

//Append page structure
main.append(searchCol.append(searchBoxRow.append(searchForm.append(searchBox, searchButton)), currentLocationRow.append(currentLocationCol), searchHistoryRow), weatherCol.append(weatherRow.append(currentWeatherCol.append(cityTitle, tempDisplay, humidityDisplay, windSpeedDisplay, uvIndexDisplay, currentWeatherIcon))), fiveDayForecastCol.append(fiveDayForecastRow.append(fiveDayForecastTitleCol)));

searchButton.append($("<svg>").addClass("svg-search").attr("data-feather", "search"));
feather.replace({ class: 'svg-search', 'stroke-width': 4, 'width': 30, 'height': 30 });

//Function to update search history
function populateHistory() {
    //Empty searchHistoryRow
    searchHistoryRow.empty();
    //Append all search items from searchHistory[]
    for (let i = 0; i < searchHistory.length; i++) {
        const searchItem = searchHistory[i];
        var searchItemCol = $("<div>").addClass("col-12 p-1 search-item search-item-" + searchItem).attr("data-city", searchItem).text(searchItem);
        searchItemCol.click(function () {
            // console.log($(this).attr("data-city"));
            populateWeather($(this).attr("data-city"));
        });
        searchHistoryRow.append(searchItemCol);
    }
    if (searchHistory.length > 0) {
        var clearHistoryCol = $("<div>").addClass("col-12 p-1 clear-history").text("Clear History");
        searchHistoryRow.append(clearHistoryCol);
        clearHistoryCol.click(clearHistory);
    }
}

var clearHistory = function () {
    localStorage.clear();
    searchHistoryRow.empty();
    searchHistory = [];
}

//Take city and updates weather data based on that city
function populateWeather(city, lat = "", lon = "") {
    //Set api call variables
    var endpoint = "weather?"; //
    if (lat === "" && lon === "") {
        var selectedCity = "q=" + city;
    } else {
        var selectedCity = "lat=" + lat + "&lon=" + lon;
    }

    var apiKey = "&APPID=ce57d686b7490927cdc52deefe0edbc7";
    var queryURL = "https://api.openweathermap.org/data/2.5/"
    //api call
    $.ajax({
        url: queryURL + endpoint + selectedCity + apiKey,
        method: "GET"
    }).then(function (response) {
        city = response.name + ", " + response.sys.country;
        if (!searchHistory.includes(city)) {
            storeHistory(city);
            populateHistory();
        }
        //Update current weather data with api call data
        cityTitle.text(city);
        tempDisplay.text(`Temperature: ${Math.round(ktof(response.main.temp))} °F`);
        humidityDisplay.text(`Humidity: ${response.main.humidity}%`);
        windSpeedDisplay.text(`Wind Speed: ${response.wind.speed} mph`);
        console.log(response);
        currentWeatherIcon.attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
        // console.log(response);

        //Change endpoint and make new api call because UV data is on a new endpoint
        endpoint = "uvi?";
        //set coordinate variables for api call
        var lat = "&lat=" + response.coord.lat;
        var lon = "&lon=" + response.coord.lon;
        $.ajax({
            url: queryURL + endpoint + apiKey + lat + lon,
            method: "GET"
        }).then(function (response) {
            // console.log(response);
            uvIndexDisplay.text(`UV Index: ${response.value}`);

            //Change endpoint for next api call for five-day forecast
            endpoint = "forecast?";
            $.ajax({
                url: queryURL + endpoint + selectedCity + apiKey,
                method: "GET"
            }).then(function (response) {
                // console.log(response);
                //Set five-day forecast elements
                fiveDayForecastTitleCol.empty();
                fiveDayForecastRow.empty();
                fiveDayForecastRow.append(fiveDayForecastTitleCol);
                fiveDayForecastTitleCol.append($("<h4>").text("5-Day Foreacast"));

                //create five-day forecast array from hourly array (response gives hourly array)
                hourlyArray = response.list;
                fiveDayArray = [];
                for (let i = 0; i < hourlyArray.length; i++) {
                    const element = hourlyArray[i];
                    // console.log(moment.unix(element.dt).format("H"));

                    //push element into fiveDayArray if element's hour is 13 (1:00pm)
                    if (moment.unix(element.dt).format("H") === "13") {
                        fiveDayArray.push(element);
                    }
                }

                //Create html elements based on fiveDayArray
                for (let i = 0; i < fiveDayArray.length; i++) {
                    const element = fiveDayArray[i];

                    var forecastBlock = $("<div>").addClass("text-nowrap col-12 col-sm forecast-block forecast-block-" + (i + 1));
                    var forecastBlockDate = $("<h6>").addClass("forecast-block-date");
                    var forecastBlockIcon = $("<img>").addClass("forecast-block-img");
                    var forecastBlockTemp = $("<p>").addClass("forecast-block-temp");
                    var forecastBlockHumidity = $("<p>").addClass("forecast-block-humidity");

                    forecastBlockDate.text(moment.unix(element.dt).format("L"));
                    forecastBlockIcon.attr("src", "http://openweathermap.org/img/wn/" + element.weather[0].icon + "@2x.png");
                    forecastBlockTemp.text(`Temperature: ${Math.round(ktof(element.main.temp))} °F`);
                    forecastBlockHumidity.text(`Humidity: ${element.main.humidity}%`);

                    forecastBlock.append(forecastBlockDate);
                    forecastBlock.append(forecastBlockIcon);
                    forecastBlock.append(forecastBlockTemp);
                    forecastBlock.append(forecastBlockHumidity);
                    fiveDayForecastRow.append(forecastBlock);
                    //Show the weatherCol
                    weatherCol.show();
                    // console.log(moment.unix(element.dt).format("dddd HH:MM"));
                    // console.log(element);
                }
                // console.log("stored " + city);
            });
        });
    });
}

//Search button click
searchButton.click(function (event) {
    event.preventDefault()
    var city = searchBox.val();
    populateWeather(city);
});

currentLocationCol.click(function (event) {
    navigator.geolocation.getCurrentPosition(function (position) {
        populateWeather("coords", position.coords.latitude, position.coords.longitude);
    });
});

//Innitialize search history
populateHistory();

//Innitialize weather data with last searched item if it exists
if (searchHistory[searchHistory.length - 1] !== undefined) {
    populateWeather(searchHistory[searchHistory.length - 1]);
}