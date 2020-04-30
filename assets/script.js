//event listener for the search button. assigns the value of the text in the input to a variable.
$("#searchButton").on("click", function(){
    var city = $("#searchValue").val();
    console.log(city);
    searchCity(city);
})

//use the variable city to run a query on the open weather map api


var searchCity = function(city){
    //set the variables to build the URL
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q="
    var APIkey = "30274fe75136ca85c5beb0d0cc14ac7a"
    queryURL = weatherURL+city+"&appid="+APIkey+"&units=imperial"
    //make the ajax call
    console.log(queryURL)
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response){
        console.log(response)
        //set variables for data to display
        var cityName = response.name;
        var dateToday = new Date().toLocaleDateString();
        var temp = response.main.temp;
        var rh = response.main.humidity;
        var wind = response.wind.speed;

        //variables for elements that will be displayed in Today's Weather Section
        var today = $("#today");
        var todayCard = $("<div>").addClass("card");
        var todayCardTitle = $("<h3>").addClass("card-title").text(cityName + " " + dateToday);
        var icon = $("<img>").attr("src","http://openweathermap.org/img/w/"+ response.weather[0].icon+".png").height(60).width(60)
        var todayCardData = $("<ul>").addClass("card-text");
        var todayTemp = $("<li>").text("Temperature: "+ temp + " degrees F");
        var todayRH = $("<li>").text("Relative Humidity: "+ rh + "%");
        var todayWind = $("<li>").text("Wind Speed: "+wind+" mph");

        //append the Today's Weather Card and its contents to the page
        today.append(todayCard);
        todayCard.append(todayCardTitle)
        todayCardTitle.append(icon);
        todayCard.append(todayCardData);
        todayCardData.append(todayTemp, todayRH, todayWind);




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
--Function that displays today's weather on the page
--Function that displays the 5 day forecast on the page
--Clear the Today's Weather Section when search button is clicked




=============================================================================================================================*/