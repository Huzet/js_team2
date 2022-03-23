// Keys
require('dotenv').config()

const express = require('express');
const fetch = require("node-fetch");
const cors = require('cors')
const server = express();
const port = process.env.PORT || 3000;
const fs = require('fs');

//assuming app is express Object.
server.get('/',function(req,res) {
    res.sendFile('index.html');
  });

// enabling cors
server.use(cors());

// console.log(process);

// get secret variables
// let rawdata = fs.readFileSync('pass.json');
// let secret = JSON.parse(rawdata);
// const secret_key = secret.secret_key;
// const secret_key_imdb = secret.secret_key_imdb

// req = request, and res = response at the path of /reqest
server.get('/request', function (req, res) {
    console.log(req.query)
    const { movie_title, movie_year } = req.query;
    let omdb_link;
    console.log(movie_title, movie_year);

    if (movie_year === undefined){
        omdb_link = `http://www.omdbapi.com/?t=${movie_title.replace(/ /g,"+")}&apikey=${process.env.SECRET_KEY_OMDBAPI}`;
    }
    else {
        omdb_link = `http://www.omdbapi.com/?t=${movie_title.replace(/ /g,"+")}&y=${movie_year}&apikey=${process.env.SECRET_KEY_OMDBAPI}`;
    }

    fetch(omdb_link)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        return res.send(data);
    })
})

server.get('/trailer', function (req, res){
    const { imdbid } = req.query;

    const moviedb_api_url = `https://api.themoviedb.org/3/movie/${imdbid}/videos?api_key=${process.env.SECRET_KEY_IMDBAPI}&language=en-US`;

    console.log(moviedb_api_url)
    fetch(moviedb_api_url)
    .then(function (response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        return res.send(data);
    })

})

server.get('/random', function(req, res){
    const random_movie_api = "https://k2maan-moviehut.herokuapp.com/api/random"

    fetch(random_movie_api)
    .then(function (response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        return res.send(data);
    })

})

server.listen(port, function(){
    console.log("listening on port 3000")
})