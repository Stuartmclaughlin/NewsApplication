// Define API key and link to guardian
var API_Key = 'api-key=71fcd276-7828-4e87-a78e-a8e7e3eddf49';
var link = 'https://content.guardianapis.com/';

// Error handling code to present the user with a custom alert based on the error code
var Default_Error = function(response) {
    if (response.status === 0) {
        alert('Network Problem');
    } else if (response.status == 404) {
        alert('Requested page not found. [404]');
    } else if (response.status == 401) {
        alert('Unauthorised. [401]');
    } else if (response.status == 500) {
        alert('Internal Server Error [500].');
    } else {
        alert('FAIL.');
    }
};



//function used throughout to make ajax calls
function getNewsInfo(query_info, successFunction, errorHandle) {
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: true,
        url: link + query_info + API_Key,
        success: successFunction,
        error: errorHandle
    })
}



//function to display information from ajax call in tabs 
var displayInfo = function(data) {

    var div_ID = sectionName; //This defines the div to append the news stories to

    var result = data.response.results;
    for (var i = 0; i < data.response.results.length; i++) //for loop to loop through the json response from the server and display the information recieved within a list
    {
        $(div_ID).append("<div class='col-md-6 col-lg-3 col-sm-6 mb-5'><div class='card storybtn' data-toggle='modal' data-target='#story_modal' id='" + result[i].id + "'><img class='card-img-top' src='" + result[i].fields.thumbnail + "' alt='Card image cap'><div class='card-body'><h5 class='card-title'>" + result[i].webTitle + "</h5><p class='card-text'><small class='text-muted'>" + result[i].sectionName + "</small></p></div></div>");
    }
}

//The function for add favourites button

function addToFavourites(fav_news) {

    if (localStorage && localStorage.getItem('favourites')) { //IF statement to add the favourite to the end of the array
        var favourites = JSON.parse(localStorage.getItem('favourites'));
        favourites.items.push(fav_news);
        alert('The article has been added to your favourites. Please refresh page to view changes.');
        localStorage.setItem('favourites', JSON.stringify(favourites)); //sets the updated favourites
    }
}

//The function to display information from favourites in local storage by parsing it to a json format so it can be retrieved and displayed on the page

var displayFavs = function() {
    var favourite_news = JSON.parse(localStorage.getItem('favourites'));
    var fav = favourite_news.items;
    for (var i = 0; i < fav.length; i++) {
        $('#fav_posts').append("<div class='col-md-6 col-lg-3 col-sm-6 mb-5'><div><button class='btn btn-danger' data-id='" + fav[i].id + "' id='del_fav'>Delete</button></div><div class='card storybtn' data-toggle='modal' data-target='#story_modal' id='" + fav[i].id + "'><img class='card-img-top' src='" + fav[i].picture + "' alt='Card image cap'><div class='card-body'><h5 class='card-title'>" + fav[i].webTitle + "</h5><p class='card-text'><small class='text-muted'>" + fav[i].sectionName + "</small></p></div></div>");
    }
}


// function for offline search functionality

function localsearch(news) {

    // Determines what section header will be appended at the top of each section
    var section = section_title;
    search_result_list = "";
    $('#offlineResults').append("<li class='list-group-item list-group-item-dark'><h6>" + section + "</h6></li>");

    // for loop to display all of the results within local storage that include the input within their title in a list
    for (var i = 0; i < news.length; i++) {
        if (news[i].webTitle.toLowerCase().includes($("#searchquery").val().toLowerCase())) {
            search_result_list += "<li class='list-group-item'><div class='row'><div class='col'><img class='imglist' alt='weather' src='" + news[i].fields.thumbnail + "' alt='Card image cap'></div><div class='col' data-id='" + news[i].id + "' data-name='" + news[i].webTitle + "' data-section='" + news[i].sectionName + "' data-picture='" + news[i].fields.thumbnail + "'><h6><a target='_blank' href='' data-toggle='modal' data-target='#story_modal' id='" + news[i].id + "' class='storybtn'>" + news[i].webTitle + "</a></h6><p class='card-text'><small class='text-muted'>" + news[i].sectionName + "</small></p><button class='btn btn-primary' id='add_fav'>Add Favourite</button></div></div></li>";
        }
    }

    //If statement to determine if there are results or not

    if (search_result_list !== "") {
        $('#offlineResults').append(search_result_list);
    } else {
        $('#offlineResults').append("<li class='list-group-item list-group-item-light'><h6>No search results</h6></li>");
    }
}




$(document).ready(function() {
    
    //Hide search results on load
    $('#newsResults').hide();
    $('#searchResult_div').hide();
    
    //get date
    var d = new Date();
    var strDate = d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate();
    $('#date').text(strDate);

    //Initialize favourites in localstorage

    if (localStorage.getItem("favourites") === null) {
        var favourites = {};
        favourites.items = [];
        localStorage.setItem('favourites', JSON.stringify(favourites));
    }


    //On Click function to ADD a favourite

    $(document).on('click', "#add_fav", function() {

        div = $(this).parent();

        var fav_news = {}; //define empty variable for new entry

        fav_news.webTitle = $(div).attr('data-name'); //defines the attributes of the parent div and adds them to the new entry
        fav_news.id = $(div).attr('data-id');
        fav_news.sectionName = $(div).attr('data-section');
        fav_news.picture = $(div).attr('data-picture');
        addToFavourites(fav_news); // .push is used within this function to add it to the end of the array

    });

    //On Click Function to DELETE a favourite 

    $(document).on('click', "#del_fav", function() {

        var id = $(this).attr('data-id'); //sets the id to the data-id of the button which has been appended within the displayFavs function

        favs = JSON.parse(localStorage.getItem('favourites')); //retrieves the local staorage in favourites as JSON

        for (var i = 0; i < favs.items.length; i++) { //for loop and if statement in order to find if there is an id match within the array and delete it by it's positiion
            if (favs.items[i].id == id) {
                favs.items.splice(i, 1);
                alert('The article has been deleted. Please refresh page to view changes.');
            }
        }

        localStorage.setItem('favourites', JSON.stringify(favs)); // Updates the new local storage favourites
    });

    //initialize bootstrap tooltip

    $('[data-toggle="tooltip"]').tooltip()


  //Open weather API section

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) { //Use HTML5 Geolocation to find co-ordinates to use alongside the weather API
            
            //Declare variables from geolocation and API key needed for the query
                var x = position.coords.latitude;
                var y = position.coords.longitude;
                var apiKey = '&appid=1be108a3d46bf94f18e798103ee6ec09';
            
            //get.JSON method used to make an ajax call to the weather API using variables stated above to retrieve the current locations weather info
                $.getJSON("https://api.openweathermap.org/data/2.5/weather?lat=" + x + "&lon=" + y + "&units=imperial" + apiKey, function(data) {
                    var city = data.name;
                    var temp = Math.round(data.main.temp);
                    var weather = data.weather[0].description;
                    var image = "<img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png'>";
                    $("#displayBox").html("<p>" + city + " " + temp + " &deg;F " + weather + " " + image + "</p>"); //Append to the HTML page
                });
            },
            function(error) {   //Error handling for different error codes
                if (error.code == error.PERMISSION_DENIED) {
                    $("#displayBox").html("<p>Access to location data has been denied.</p>");
                } else if (error.code == error.PERMISSION_UNAVAILABLE) {
                    $("#displayBox").html("<p>Unable to access geolocation data.</p>");
                }
            });
    }

    //POPULAR TAB

    getNewsInfo('search?&show-fields=thumbnail&order-by=newest&show-most-viewed=true&page-size=4&', // Calls the function stated at top of the script to make AJAX request and pass in query
        function(data) {
            sectionName = '#popular'; //Div to display information in is declared
            popular_stories = data.response.results;
            localStorage.setItem("popular", JSON.stringify(popular_stories)); //Results stored in local_storage for offline search functionality
            console.log(data);
            displayInfo(data); //Function to display the information is called
        })
    
    //SPORTS TAB
    getNewsInfo('search?&section=sport&order-by=newest&show-fields=thumbnail&page-size=8&',
        function(data) {
            sectionName = '#sports_posts';
            console.log(data);
            displayInfo(data);
        })
    
    //SCIENCE TAB
    getNewsInfo('search?&section=science&order-by=newest&show-fields=thumbnail&page-size=8&',
        function(data) {
            sectionName = '#science_posts';
            science_stories = data.response.results;
            localStorage.setItem("science", JSON.stringify(science_stories));
            console.log(data);
            displayInfo(data);
        })

    //WORLD TAB
    getNewsInfo('search?&section=world&order-by=newest&show-fields=thumbnail&page-size=8&',
        function(data) {
            sectionName = '#world_posts';
            console.log(data);
            displayInfo(data);
        })
    
    //TECHNOLOGY TAB
    getNewsInfo('search?&section=technology&order-by=newest&show-fields=thumbnail&page-size=8&',
        function(data) {
            sectionName = '#technology_posts';
            technology_stories = data.response.results;
            localStorage.setItem("tech", JSON.stringify(technology_stories));
            console.log(data);
            displayInfo(data);
        })
    
    //POLITICS TAB
    getNewsInfo('search?&section=politics&order-by=newest&show-fields=thumbnail&page-size=8&',
        function(data) {
            sectionName = '#politics_posts';
            politics_stories = data.response.results;
            console.log(data);
            displayInfo(data);
        })
    
    //ENTERTAINMENT TAB
    getNewsInfo('search?&section=culture&order-by=newest&show-fields=thumbnail&page-size=8&',
        function(data) {
            ent_stories = data.response.results;
            localStorage.setItem("entertainment", JSON.stringify(ent_stories));
            sectionName = '#entertainment_posts';
            console.log(data);
            displayInfo(data);
        })

    //FAVOURITES TAB
    
    displayFavs(); //function called to display favourites from local storage - no AJAX request needed


    //Within this function the id of the card with the class 'storybtn' is equal to the required section of the url by appending it earlier, an AJAX request is called in order to pull in further information for this specific story and display it in the modal that is toggled by clicking the card.

    $(document).on("mousedown", ".storybtn", function() {
        var id = $(this).attr("id");

        getNewsInfo(id + '?show-fields=thumbnail%2CbodyText&',
            function(data) {
                var result = data.response.content;
                $("#story_img").attr("src", result.fields.thumbnail);
                $("#story_link").attr("href", result.webUrl);
                $("#story_title").text(result.webTitle);
                $("#story_content").text(result.fields.bodyText);
            });
    });

    // function to toggle CSS class of div to show all of the paragraph and not hav a maximum height. It also replaces the text on the button in alignment of what action is being performed.

    $("#read_More").on('click', function() {
        $(this).parent().toggleClass("showContent");

        var replaceText = $(this).parent().hasClass("showContent") ? "Read Less" : "Read More";
        $(this).text(replaceText);
    });


    //Search feature functionality

    //on click function used to clear the search 
    $("#clearbtn").on('click', function(e) {
        e.preventDefault; //prevents the default of the button
        $('#searchResult_div').hide();
        $('#nav_tabs').show();
    });

    // On click function of the search
    
    $("#searchbtn").on('click', function(e) {
        e.preventDefault();
        
        let query = $("#searchquery").val(); // define the query as what the user enters into the search bar input
        
        let url = "https://content.guardianapis.com/search?&order-by=newest&show-fields=bodyText,thumbnail&q=" + query + "&api-key=71fcd276-7828-4e87-a78e-a8e7e3eddf49"; //the query is added to the URL which is used within the AJAX request
        
        if (query !== "") { //if the query has content
            
            $.ajax({
                url: url,
                method: "GET",
                dataType: "jsonp",
                complete: function() {
                    //Hides the current top of the web page and fades in the search results
                    output = "";
                    $('#offlineResults').html(output);
                    $('#nav_tabs').hide();
                    $('#newsResults').fadeIn();
                    $('#searchResult_div').fadeIn();
                    
                    // Offline search functionality is completed first as it is searching through each section key in localstorage using localsearch(); 
                    var news = JSON.parse(localStorage.getItem('popular'));
                    section_title = 'Popular News';
                    localsearch(news);
                    var science_news = JSON.parse(localStorage.getItem('science'));
                    section_title = 'Science News';
                    localsearch(science_news);
                    var tech_news = JSON.parse(localStorage.getItem('tech'));
                    section_title = 'Technology News';
                    localsearch(tech_news);
                    var politics_news = JSON.parse(localStorage.getItem('politics'));
                    section_title = 'Politics News';
                    localsearch(politics_news);
                    var ent_news = JSON.parse(localStorage.getItem('entertainment'));
                    section_title = 'Entertainment News';
                    localsearch(ent_news);
                    var sports_news = JSON.parse(localStorage.getItem('sports'));
                    section_title = 'Sports News';
                    localsearch(sports_news);

                },
                success: function(data) {
                    var output = "";
                    var news = data.response.results;
                    // On success the output is defined as a list within a for loop ready to be appended to the search results
                    for (var i in news) { 
                        output += "<li class='list-group-item'><div class='row'><div class='col'><img class='imglist' src='" + news[i].fields.thumbnail + "' alt='Card image cap'></div><div class='col' data-id='" + news[i].id + "' data-name='" + news[i].webTitle + "' data-section='" + news[i].sectionName + "' data-picture='" + news[i].fields.thumbnail + "'><h6><a target='_blank' href='' data-toggle='modal' data-target='#story_modal' id='" + news[i].id + "' class='storybtn'>" + news[i].webTitle + "</a></h6><p class='card-text'><small class='text-muted'>" + news[i].sectionName + "</small></p><button class='btn btn-primary' id='add_fav'>Add Favourite</button></div></div></li>";

                    }
                    
                    //IF STATEMENT seeing if there has been an output in order to append it, and if not, then no search results will be appended instead.

                    if (output !== "") {
                        $('#newsResults').html(output);
                    } else {
                        var NewsnotFound = "<li class='list-group-item list-group-item-light'><h6>No search results</h6></li>";
                        $('#newsResults').html(NewsnotFound);

                    }

                },

                error: function() {
                    console.log('error');
                }

            });
        } else {
            alert("please enter something to search");
        }

    });
    
    //Smooth scroll feature for section part of Nav

    $(function() {
        $('#section_nav').on('click', function() {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.substr(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        });
    });

});