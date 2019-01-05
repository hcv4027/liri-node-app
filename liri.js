//Dependencies
//=======================================
require('dotenv').config();
var axios = require('axios');
var keys = require('./keys.js');
var moment = require("moment");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require('fs');

// Variable that takes in all of the command line arguments
var inputString = process.argv;

// Parses the command line argument to capture the command 
var command = inputString[2];


console.log("User chose the following Command: "+ command.toUpperCase());

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
            get_Bands(searchTerm);
            break;
        }

        case "movie-this":
        {
            get_Movie(searchTerm);
            break;
        }

        case "spotify-this-song":
        {
            get_Spotify(searchTerm);
            break;
        }

        case "do-what-it-says":
        {
            get_Random();
            break;
        }
        default:
        console.log("DEFAULTED")
    }
}
 

//Function for axios to call Bands In Town API and return with concert information results.
var get_Bands = function(artist)
{
    var queryBands = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryBands)
    .then(
        function(response) {
          var concertData = response.data;
    
          if (!concertData.length) {
            console.log("No concert dates found for " + artist+ " at this time!");
            return;
          }
    
          console.log("Upcoming concerts for: " + artist + ":");
          console.log("===============================");
    
          for (var i = 0; i < concertData.length; i++) {
            var show = concertData[i];
    
            // Iterate and display data about each concert.
            // If a concert doesn't have a region, show the country instead.
            console.log(
            "• " + moment(show.datetime).format("MM/DD/YYYY")
            +" - " +show.venue.name + " in "
            + show.venue.city + ", "+
            (show.venue.region || show.venue.country));
          }
        }
      );
    };

//Function that makes a call to the Spotify API to gather results for the song search parameter added by the user.
//If the user dpoes not input an song, the song name is defaulted to The Sign by Ace of Bsse.
var get_Spotify = function(songName) {
        if (songName === undefined || songName === "") {
          songName = "The Sign";
        }
        spotify.search(
          {
            type: "track",
            query: songName
          },
          function(err, data) {
            if (err) {
              console.log("Your Spotify search caused an error to occur: " + err);
              return;
            }
      
            var songs = data.tracks.items;
      
            for (var i = 0; i < songs.length; i++) {
              console.log("Song: " + (i + 1)+ " of "+ songs.length);
              console.log("Artist(s): " + songs[i].artists.map(getArtistNames));
              console.log("Name of the Song: " + songs[i].name);
              console.log("Song Preview Link: " + songs[i].preview_url);
              console.log("Album: " + songs[i].album.name);
              console.log("-----------------------------------");
            }
          }
        );
      };
      
//Function makes a call to the OMDB API to find movie results by title or if no movie title is given
// the movie title is defauklted to Mr. Nobody.
var get_Movie = function(movieName) {
    if (movieName === undefined || movieName === "") {
        movieName = "Mr Nobody";
    }
    
    var urlGet =
        "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
    
    axios.get(urlGet).then(
        function(response) {
        var movieData = response.data;
    
        console.log("Movie Title: " + movieData.Title);
        console.log("Release Year: " + movieData.Year);
        console.log("Rated: " + movieData.Rated);
        console.log("IMDB Rating: " + movieData.imdbRating);
        console.log("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
        console.log("Country: " + movieData.Country);
        console.log("Language: " + movieData.Language);
        console.log("Actors: " + movieData.Actors);
        console.log("Plot: " + movieData.Plot);
        }
    );
};

//Function uses filestream to open a text file called: randpm.txt, and reads an embeded command from the file
// that gets executed. Results are the displayed an the filestream closed.
var get_Random = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);
  
      var collection = data.split(",");
  
      if (collection.length === 2) {
        commandControl(collection[0], collection[1]);
      } else if (collection.length === 1) {
        commandControl(collection[0]);
      }
    });
  };
    
//Invoking the commnd control call that parses the command the user inputs for further processing.
commandControl(command, searchTerm);
