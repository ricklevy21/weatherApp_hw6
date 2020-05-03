$( document ).ready(function() {

    //event listener for the search button. assigns the value of the text in the input to a variable.
    $("#searchButton").on("click", function(){
        var city = $("#searchValue").val();
        searchCity(city);
        getFiver(city);
        $("#searchValue").val("")
        
    })



    //array that holds all previous searches
    var searchHistory = [];

    //function that adds searches to the history section
    var addToHistory = function(city){
        var newCity = $("<li>");
        newCity.text(city).attr("class", "list-group-item list-group-item-action");
        $("#history").append(newCity);

    }

    //function to get today's weather in city input by user
    var searchCity = function(city){
        //set the variables to build the URL
        var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q="
        var APIkey = "30274fe75136ca85c5beb0d0cc14ac7a"
        queryURL = weatherURL+city+"&appid="+APIkey+"&units=imperial"
        //make the ajax call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){

            //check if city is already in history, if it's not add new search to history array
            if (searchHistory.indexOf(city) === -1) {
                //add new city to array
                searchHistory.push(city)
                //save array to local storage
                localStorage.setItem("cityStorage", JSON.stringify(searchHistory));
                //add the city to the history list on the page
                addToHistory(city);
            }
            
            //set variables for data to display
            var cityName = response.name;
            var dateToday = new Date().toLocaleDateString();
            var temp = response.main.temp;
            var rh = response.main.humidity;
            var wind = response.wind.speed;
            
            //variables for elements that will be displayed in Today's Weather Section
            var today = $("#today");
            var todayCard = $("<div>").addClass("card");
            var todayCardTitle = $("<h3>").addClass("card-title mx-3").text(cityName + " " + dateToday);
            var icon = $("<img>").attr("src","http://openweathermap.org/img/w/"+ response.weather[0].icon+".png").height(60).width(60)
            var todayCardData = $("<ul>").addClass("card-text mx-3 mb-3").attr("id", "todayData");
            var todayTemp = $("<p>").text("Temperature: "+ temp + " \xB0F");
            var todayRH = $("<p>").text("Relative Humidity: "+ rh + "%");
            var todayWind = $("<p>").text("Wind Speed: "+wind+" mph");
            
            //clear the Today's Weather Section
            today.empty();
            
            //append the Today's Weather Card and its contents to the page
            today.append(todayCard);
            todayCard.append(todayCardTitle)
            todayCardTitle.append(icon);
            todayCard.append(todayCardData);
            todayCardData.append(todayTemp, todayRH, todayWind);
            
            //figure out lat/lon so can use to get UV index
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            UV(lat, lon);
            
        })
        
    }

    //function to get the 5 day forecast for city input by user
    var getFiver = function(city){
        //set the variables to build the URL
        var weatherURL = "http://api.openweathermap.org/data/2.5/forecast?q="
        var APIkey = "30274fe75136ca85c5beb0d0cc14ac7a"
        queryURL = weatherURL+city+"&appid="+APIkey+"&units=imperial"
        //make the ajax call
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response){
            //empty the forecast section
            $("#fiveDay").empty();
            $("#forecastHeading").empty();
            //add heading for forecast section
            var forecastHeading = $("<h3>").text("5 Day Forecast").attr("class", "m-3");
            $("#forecastHeading").append(forecastHeading);
            //need a loop to go over all of the objects in the "list" array
            for (var i = 0; i < response.list.length; i++){
                //api returns forecast for every 3 hours. Only need 1 forecast per day. so only get forecast for noon.
                if (response.list[i].dt_txt.indexOf("12:00:00") !== -1) {
                    //set variables for data to display
                    var forecast = $("#fiveDay");
                    var forecastCol = $("<div>").attr("class", "col-md-2");
                    var forecastCard = $("<div>").attr("class", "card bg-primary");
                    var forecastCardTitle = $("<div>").attr("class", "card-title text-white ml-3 mt-3");
                    var forecastCardText = $("<div>").attr("class", "text-white m-3");
                    var forecastDate = $("<h5>").text(new Date(response.list[i].dt_txt).toLocaleDateString());
                    var forecastTemp = $("<p>").text("Temp: "+response.list[i].main.temp + " \xB0F");
                    var forecastRH = $("<p>").text("Humidity: "+response.list[i].main.temp + "%");
                    var forecastIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/"+response.list[i].weather[0].icon+".png");

                    //append the data to the page
                    forecast.append(forecastCol);
                    forecastCol.append(forecastCard);
                    forecastCard.append(forecastCardTitle, forecastCardText);
                    forecastCardTitle.append(forecastDate);
                    forecastCardText.append(forecastIcon);
                    forecastCardText.append(forecastTemp, forecastRH);

                }
                
            }
            
            
            
        })
    }

    //function to get the UV index for lat/lon that matches the city input by the user
    var UV = function(lat, lon){
        //set the variables to build the URL
        var weatherURL = "http://api.openweathermap.org/data/2.5/uvi?"
        var APIkey = "30274fe75136ca85c5beb0d0cc14ac7a"
        queryURL = weatherURL+"&appid="+APIkey + "&lat=" + lat +"&lon="+ lon
        //make the ajax call
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response){
            //variables for UV index elements
            var UVvalue = response.value;
            var UVindex = $("<p>").text("UV Index: ");
            var UVindexVal = $("<span>").text(UVvalue);
            //color code UV index
            if (Math.floor(UVvalue) >= 0 && Math.floor(UVvalue) <= 2){
                UVindexVal.addClass("btn btn-success")
            } else if (Math.floor(UVvalue) >= 3 && Math.floor(UVvalue) <= 7){
                UVindexVal.addClass("btn btn-warning")
            } else if (Math.floor(UVvalue) >= 8){
                UVindexVal.addClass("btn btn-danger")
            } else {}
            //append UV index to today's weather card
            $("#todayData").append(UVindex.append(UVindexVal));
        })
    }


    //function that adds values from array in local storage to the history array, and then appends items from the history array onto the history section
    var getStorageHist = function(){
        //grab items from local history
        var fromStor = localStorage.getItem("cityStorage")
        //parse items from local history
        fromStor = JSON.parse(fromStor);
        //loop through items from local history, adding each index to the searchHistory array (if the array fromStor is not null)
        if (fromStor !== null){
            for (var i = 0; i < fromStor.length; i++){
                searchHistory.push(fromStor[i]);
            }
            for (var i = 0; i < searchHistory.length; i++){
                var addCity = $("<li>");
                addCity.text(searchHistory[i]).attr("class", "list-group-item list-group-item-action");
                $("#history").append(addCity);
            }
        }
    }
    getStorageHist();

    //event listener for history section
    $("#history").on("click", "li", function(){
        searchCity($(this).text());
        getFiver($(this).text());
    })

});




/*=============================================================================================================================//
TO DO LIST

-x-Grab user's text input and put the value .val() into a variable that is used in the ajax call
-x-Create ajax call that gets the following from weather api
    -x-city name
    -x-today's date
    -x-icon
    -x-temperature in F (convert if needed)
    -x-RH
    -x-Wind speed in mph (convert if needed)
    -x-UV index

-x-Create ajax call that gets the following from weather api
    -x-5 day forecast
        -x-date
        -x-icon
        -x-temp
        -x-rh
    -x-Function that clears the input after the search button is clicked
    -x-Function that displays today's weather on the page
    -x-Function that displays the 5 day forecast on the page
    -x-Clear the Today's Weather Section when search button is clicked
    -x-Check if city already exists in history
    -x-Function that adds any value searched to an array in local storage, if not there already
    -x-Function that adds values from array in local storage to the history section-gonna need a loop dee loop
    -x-add event listener to each city (maybe use delegation?) so that when clicked, performs search based on the value of the text




=============================================================================================================================*/