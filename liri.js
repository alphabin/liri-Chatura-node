require("dotenv").config();

var keys = require('./keys.js');
var request = require("request");
var fs = require("fs");

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Grabbing the search type argument
var search = process.argv[2];
// Joining the remaining arguments since an actor or tv show name may contain spaces
var term = process.argv.slice(3).join(" ");


function evaluate(search1, term1) {

    //search
    if (!search1) {
        search1 = "my-tweets";
    }

    // By default, if no search term is provided, search for "Andy Griffith"
    if (!term1) {
        term1 = "Beach";
    }

    switch (search1) {
        case "movie-this":
            movieSearch(term1);
            break;
        case "my-tweets":
            twitterSearch()
            break;
        case "spotify-this-song":
            SpotySearch(term1);
            break;
        case "do-what-it-says":
            {
                fs.readFile("random.txt", "utf8", function(error, data) {
                    var tempCommand;
                    var termSearch;
                    // If the code experiences any errors it will log the error to the console.
                    if (error) {
                      return console.log(error);
                    }
                  
                    // We will then print the contents of data
                    console.log(data);
                  
                    // Then split it by commas (to make it more readable)
                    var dataArr = data.split(",");
                     
                    tempNameSearch= dataArr[0].trim();
                    tempCommand =dataArr.slice(1);
                  
                    // We will then re-display the content as an array for later use.
                    evaluate( tempNameSearch, tempCommand);
                  
                  });
                  
            }
            break;

    }
}

function SpotySearch(querySearch) {
    spotify.search({ type: 'track', query: querySearch }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("album : " + data.tracks.items[0].album.name);
        console.log("song : " + data.tracks.items[0].name);
        console.log("url : " + data.tracks.items[0].href);
        console.log("name : " + data.tracks.items[0].artists[0].name);

    });
}

function twitterSearch() {
    var params = { screen_name: '@AhaChatty' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log("\t\t\t-----------------Start-----------------------");
            for (var ii = 0; ii < tweets.length - 1; ii++) {
                console.log("\t\t\t\t----------------------------------");
                console.log("\t\t\t\t" + tweets[ii].text);
                console.log("\t\t\t\t" + tweets[ii].created_at);

            }
            console.log("\t\t\t----------------End--------------------------");
        }
    });
}

function movieSearch(name) {
    var title = name;
    var queryURL = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
    request(queryURL, function (err, response, body) {
        // parse the response body (string) to a JSON object
        var jsonData = JSON.parse(body);
        //console.log(jsonData);
        // showData ends up being the string containing the show data we will print to the console
        var showData = [
            "title: " + jsonData.Title,
            "year: " + jsonData.Year,
            "rating: " + jsonData.Ratings[0].Value,
            "country: " + jsonData.Country,
            "language: " + jsonData.Language,
            "plot: " + jsonData.Plot,
            "actors: " + jsonData.Actors
        ].join("\n\n");
        console.log(showData);
    });
}

evaluate(search,term);