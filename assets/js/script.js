


//Store Search History
//If there is not yet a searchhistory, create variable for search history, otherwise, store user's history in variable, searchHistory
if (localStorage.getItem("weathersearchhistory") === null) {
    var searchHistory = [];
} else {
    var searchHistory = JSON.parse(localStorage.getItem("weathersearchhistory"));
}

function ktof(k) {
    return ((k - 273.15) * (9 / 5)) + 32;
}

function ktoc(k) {
    return (k - 273.15);
}

//function to store history
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

//Create page structure
var searchCol = $("<div>").addClass("col-12 col-sm-4 search-col");
var searchBoxRow = $("<div>").addClass("row no-gutters search-box-row");
var searchForm = $("<form>").addClass("search-form w-100 h-100 d-flex align-items-center");
var searchBox = $("<input>").addClass("input w-100").attr({ 'type': 'text', 'name': 'searchbox', 'placeholder': 'Enter city name here' });
var searchButton = $("<button>").addClass("btn btn-primary search-btn");
var searchHistoryRow = $("<div>").addClass("row no-gutters search-history-row");


var weatherCol = $("<div>").addClass("col-12 col-sm-8 weather-col");
var weatherRow = $("<div>").addClass("row no-gutters current-weather-row");
var currentWeatherCol = $("<div>").addClass("col-12 current-weather-col")
var cityTitle = $("<h1>").addClass("city-title display-4")
var tempDisplay = $("<p>").addClass("temp-display");
var humidityDisplay = $("<p>").addClass("humidity-display");
var windSpeedDisplay = $("<p>").addClass("wind-speed-display");
var uvIndexDisplay = $("<p>").addClass("uv-index-display");
var fiveDayForecastCol = $("<div>").addClass("col-12 five-day-forecast-col")
var fiveDayForecastRow = $("<div>").addClass("row row-cols-5 five-day-forecast-row");
var fiveDayForecastTitleCol = $("<div>").addClass("col-12 five-day-fore-cast-title");


//Append all of that
main.append(searchCol.append(searchBoxRow.append(searchForm.append(searchBox, searchButton)), searchHistoryRow), weatherCol.append(weatherRow.append(currentWeatherCol.append(cityTitle, tempDisplay, humidityDisplay, windSpeedDisplay, uvIndexDisplay), fiveDayForecastCol.append(fiveDayForecastRow.append(fiveDayForecastTitleCol)))));
searchButton.append($("<svg>").addClass("svg-search").attr("data-feather", "search"));
feather.replace({ class: 'svg-search', 'stroke-width': 4, 'width': 30, 'height': 30 });

for (let i = 0; i < searchHistory.length; i++) {
    const searchItem = searchHistory[i];
    searchHistoryRow.append($("<div>").addClass("col-12 search-item search-item-" + searchItem).attr("data-city", searchItem).text(searchItem));
}

function populateWeather(city) {
    
    var endpoint = "weather?";
    var selectedCity = "q=" + city;
    var apiKey = "&APPID=ce57d686b7490927cdc52deefe0edbc7";
    var queryURL = "http://api.openweathermap.org/data/2.5/"
    $.ajax({
        url: queryURL + endpoint + selectedCity + apiKey,
        method: "GET"
    }).then(function (response) {
        cityTitle.text(response.name);
        tempDisplay.text(`Temperature: ${Math.round(ktof(response.main.temp))} °F`);
        humidityDisplay.text(`Humidity: ${response.main.humidity}%`);
        windSpeedDisplay.text(`Wind Speed: ${response.wind.speed} mph`);
        console.log(response);

        endpoint = "uvi?";
        var lat = "&lat=" + response.coord.lat;
        var lon = "&lon=" + response.coord.lon;

        $.ajax({
            url: queryURL + endpoint + apiKey + lat + lon,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            uvIndexDisplay.text(`UV Index: ${response.value}`);
            endpoint = "forecast?";
            $.ajax({
                url: queryURL + endpoint + selectedCity + apiKey,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                fiveDayForecastTitleCol.empty();
                fiveDayForecastRow.empty();
                fiveDayForecastRow.append(fiveDayForecastTitleCol);
                fiveDayForecastTitleCol.append($("<h4>").text("5-Day Foreacast"));
                hourlyArray = response.list;
                fiveDayArray = [];
                for (let i = 0; i < hourlyArray.length; i++) {
                    const element = hourlyArray[i];
                    // console.log(moment.unix(element.dt).format("H"));
                    if (moment.unix(element.dt).format("H") === "13" && moment.unix(element.dt).format("dddd") !== moment().format("dddd")) {
                        fiveDayArray.push(element);
                    }
                }
                for (let i = 0; i < fiveDayArray.length; i++) {
                    const element = fiveDayArray[i];
                    var forecastBlock = $("<div>").addClass("text-nowrap col-12 col-sm forecast-block forecast-block-" + (i + 1));
                    var forecastBlockDate = $("<h6>").addClass("forecast-block-date");
                    var forecastBlockIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + element.weather[0].icon + "@2x.png");
                    var forecastBlockTemp = $("<p>").addClass("forecast-block-temp");
                    var forecastBlockHumidity = $("<p>").addClass("forecast-block-humidity");

                    forecastBlockDate.text(moment.unix(element.dt).format("L"));
                    forecastBlockTemp.text(`Temperature: ${Math.round(ktof(element.main.temp))} °F`);
                    forecastBlockHumidity.text(`Humidity: ${element.main.humidity}%`);

                    forecastBlock.append(forecastBlockDate);
                    forecastBlock.append(forecastBlockIcon);
                    forecastBlock.append(forecastBlockTemp);
                    forecastBlock.append(forecastBlockHumidity);
                    fiveDayForecastRow.append(forecastBlock);
                    console.log(moment.unix(element.dt).format("dddd HH:MM"));
                    console.log(element);
                }
            });
        });
    });
}




//button function
searchButton.click(function (event) {
    event.preventDefault()
    var city = searchBox.val();
    populateWeather(city);
    // example api call
    // http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={APIKEY}

});

if (searchHistory[searchHistory.length - 1] !== undefined) {
    populateWeather(searchHistory[searchHistory.length - 1]);
}