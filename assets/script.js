//event listener for the search button. assigns the value of the text in the input to a variable.
$("#searchButton").on("click", function(){
    var city = $("#searchValue").val();
    searchCity(city);
    getFiver(city);
    $("#searchValue").val("")
    
})

//use the variable city to run a query on the open weather map api

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
        //if statement that checks if history array has the city searched or not. if it doesnt add it to the list.
        
        
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
        var todayTemp = $("<li>").text("Temperature: "+ temp + " \xB0F");
        var todayRH = $("<li>").text("Relative Humidity: "+ rh + "%");
        var todayWind = $("<li>").text("Wind Speed: "+wind+" mph");
        
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
    console.log(queryURL)
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response){
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
                var forecastCardTitle = $("<div>").attr("class", "card-title text-white");
                var forecastCardText = $("<div>").attr("class", "text-white m-3");
                var forecastDate = $("<h5>").text(new Date(response.list[i].dt_txt).toLocaleDateString());
                var forecastTemp = $("<p>").text("Temp: "+response.list[i].main.temp + " \xB0F");
                var forecastRH = $("<p>").text("Humidity: "+response.list[i].main.temp + "%");
                var forecastIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/"+response.list[i].weather[0].icon+".png");

                //empty the forecast section
                forecastCol.empty();
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
    console.log(queryURL)
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response){
        //append UV index to today's weather card
        var UVvalue = response.value;
        var UVindex = $("<li>").text("UV Index: "+UVvalue);
        $("#todayData").append(UVindex);
        


    })
}









/*=============================================================================================================================//
TO DO LIST

-x-Grab user's text input and put the value .val() into a variable that is used in the ajax call
--Create ajax call that gets the following from weather api
    --city name
    --today's date
    --icon
    --temperature in F (convert if needed)
    --RH
    --Wind speed in mph (convert if needed)
    --UV index

--Create ajax call that gets the following from weather api
    --5 day forecast
        --date
        --icon
        --temp
        --rh
--Function that adds a search to the search history in the form of a button
--Function that clears the input after the search button is clicked
-x-Function that displays today's weather on the page
--Function that displays the 5 day forecast on the page
-x-Clear the Today's Weather Section when search button is clicked




=============================================================================================================================*/