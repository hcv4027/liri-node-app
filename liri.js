//Dependencies
//=======================================
require('dotenv').config();
var axios = require('axios');
var keys = require('./keys.js');
var moment = require("moment");
var inquirer = require('inquirer');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require('fs');

// Variable that takes in all of the command line arguments
var inputString = process.argv;

// Parses the command line argument to capture the command 
var command = inputString[2];


console.log("User chose the following Command "+ command);

var searchTerm = process.argv.slice(3).join(" ");
console.log(searchTerm);

var getArtistNames = function(searchTerm) {
    return searchTerm.name;
  };
  

function commandControl(command, searchTerm)
{
    switch (command)
    {
        case "concert-this":
        {
            console.log("Concert Lookup");
            get_Bands(searchTerm);
            break;
        }
        

        case "movie-this":
        {
            console.log("Movie Lookup");
            get_Movie(searchTerm);
            break;
        }
        

        case "spotify-this-song":
        {
            console.log("Spotify Lookup");
            get_Spotify(searchTerm);
            break;
        }

        case "do-what-it-says":
        {
            console.log("Text File Load Lookup");
            get_Random();
            break;
        }
        default:
        console.log("DEFAULTED")
    }
}
 
//function axios to call spotify
//function for axios to call omdb


//function for axios to call bands in town
//BANDS IN TOWN************************************

//REWORK TEXT DISPLAY FOR THIS FUNCTION!!!!!!!!!!!!!!!!!!!!
var get_Bands = function(artist)
{
    var queryBands = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryBands)
    .then(
        function(response) {
          var concertData = response.data;
          console.log(concertData);
    
          if (!concertData.length) {
            console.log("No results found for " + artist);
            return;
          }
    
          console.log("Upcoming concerts for " + artist + ":");
          console.log("===============================");
    
          for (var i = 0; i < concertData.length; i++) {
            var show = concertData[i];
    
            // Print data about each concert
            // If a concert doesn't have a region, display the country instead
            // Use moment to format the date
            console.log(
              " - " +show.venue.city +
                "," +
                (show.venue.region || show.venue.country) +
                " at " +
                show.venue.name +
                " " +
                moment(show.datetime).format("MM/DD/YYYY")
            );
          }
        }
      );
    };

var get_Spotify = function(songName) {
        if (songName === undefined) {
          songName = "The Sign";
        }
      
        spotify.search(
          {
            type: "track",
            query: songName
          },
          function(err, data) {
            if (err) {
              console.log("Error occurred: " + err);
              return;
            }
      
            var songs = data.tracks.items;
      
            for (var i = 0; i < songs.length; i++) {
              console.log(i);
              console.log("artist(s): " + songs[i].artists.map(getArtistNames));
              console.log("song name: " + songs[i].name);
              console.log("preview song: " + songs[i].preview_url);
              console.log("album: " + songs[i].album.name);
              console.log("-----------------------------------");
            }
          }
        );
      };
      
var get_Movie = function(movieName) {
    if (movieName === undefined) {
        movieName = "Mr Nobody";
    }
    
    var urlHit =
        "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
    
    axios.get(urlHit).then(
        function(response) {
        var jsonData = response.data;
    
        console.log("Title: " + jsonData.Title);
        console.log("Year: " + jsonData.Year);
        console.log("Rated: " + jsonData.Rated);
        console.log("IMDB Rating: " + jsonData.imdbRating);
        console.log("Country: " + jsonData.Country);
        console.log("Language: " + jsonData.Language);
        console.log("Plot: " + jsonData.Plot);
        console.log("Actors: " + jsonData.Actors);
        console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
        }
    );
};

var get_Random = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);
  
      var dataArr = data.split(",");
  
      if (dataArr.length === 2) {
        commandControl(dataArr[0], dataArr[1]);
      } else if (dataArr.length === 1) {
        commandControl(dataArr[0]);
      }
    });
  };
  

    
    commandControl(command, searchTerm);
//function to open text file and read
//functgion do what it says function
//function commands control (switch )