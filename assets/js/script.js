//Create main container
var container = $("<div>").addClass("container-fluid main-container");
$(document.body).append(container);

//Create header
var header = $("<div>").addClass("row no-gutters sticky-top w-100 header");
container.append(header).text("HellO");

//Create main
var main = $("<div>").addClass("row no-gutters w-100 main");
container.append(main);
//Create searchbox with button

var searchForm = $("<form>").addClass("search-form d-flex align-items-center");
var searchBox = $("<input>").addClass("input h-100").attr({'type': 'text', 'name': 'searchbox', 'placeholder': 'Enter city name here'});
var searchButton = $("<button>").addClass("btn btn-primary search-btn");
searchButton.append($("<svg>").addClass("svg-search").attr("data-feather", "search"));


searchForm.append(searchBox);
searchForm.append(searchButton);
main.append(searchForm);
feather.replace({ class: 'svg-search', 'stroke-width': 4, 'width': 48, 'height': 48});

















//Create footer















//Create col in main (navbar-ish)
//Create row/col searchbox
//Create row/col history div

//Create col in main
//create weather row

//create 5-day forecast row

// feather.replace();

