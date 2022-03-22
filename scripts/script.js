// variables 
import { secret_key } from "./modules/api_keys.js"
import { secret_key_imdb } from "./modules/api_keys.js"
const movieData = [];

let myCookie;

// chart for rating
const ctxRating = document.getElementById('movieRating').getContext('2d');
const chartRating = new Chart(ctxRating, {
    type: 'bar',
    data: {
        // get movie name
        labels: ['Movie1', 'Movie2', 'Movie3'],
        datasets: [{
            label: 'Movie Rating',
            // get movie rating
            data: [6.6, 8.6, 5.3],
            backgroundColor: [
                // function to set colors depands on how many movies
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// chart for vote
const ctxVote = document.getElementById('movieVote').getContext('2d');
const chartVote = new Chart(ctxVote, {
    type: 'doughnut',
    data: {
        // get moive name
        labels: ['Movie1', 'Movie2', 'Movie3'],
        datasets: [{
            label: 'Votes',
            // get votes
            data: [5, 9, 3],
            backgroundColor: [
            // function to set how many colors depands on how many movies
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
}});

// Search Bar 

// Button Listener
document.getElementById("searchMovieForm").addEventListener("submit", searchMovieButtonPress);

function searchMovieButtonPress(evt) {
    evt.preventDefault();
    
    // console.log(evt);
    // user input variables
    const movie_title_input = evt.target.elements[1].value.replace(/ /g,"+");;
    const movie_release_year = evt.target.elements[2].value;

    getMovieData({
        movie_title_input, 
        movie_release_year});
}

function getMovieData({movie_title_input, movie_release_year}) {
    console.log(movie_title_input, movie_release_year)
    console.log((movie_release_year.length < 1))
    let omdb_link;

    if (movie_release_year.length < 1){
        omdb_link = `http://www.omdbapi.com/?t=${movie_title_input}&apikey=${secret_key}`;
    }
    else {
        omdb_link = `http://www.omdbapi.com/?t=${movie_title_input}&y=${movie_release_year}&apikey=${secret_key}`;
    }

    fetch(omdb_link)
    .then(function (response){
        return response.json();
    })
    .then(function(data){
        movieCardData(data);
        createMovieCard(data);
    })

}

function movieCardData(data){
    movieData.push(data)
    // will delete
    justPrint();
}



// Will delete this. This is just to get data more easier
function justPrint(){
    // gets last move
    let index = (movieData.length - 1);

    console.log(movieData[index].Title)
    console.log(movieData[index].Poster)
    console.log(movieData[index].Genre)
    console.log(movieData[index].imdbRating)
    console.log(movieData[index].Actors)
    console.log(movieData[index].Released)

    console.log(movieData)
    getMovieTrailer()
}

// Will delete once we place cookie. Cookie will be placed to see if user has voted
document.getElementById("vote_up").addEventListener("submit", voteUp)
function voteUp(evt){
    evt.preventDefault();
    let count = document.getElementById("cookie_alert").innerText;
    console.log(count)
    
    console.log("cookie");
    // Cookie exists only for 30 sec
    document.cookie = "voted=yes; SameSite=None; Secure; max-age=30";
    document.getElementById("cookie_alert").innerText = parseInt(count) + 1;
    hasVoted();
}

// THis is for testing purposes can delete this along with the html element (used for reseting cookie)
document.getElementById("check_cookie").addEventListener("submit", checkCookies)
function checkCookies(evt){
    evt.preventDefault();
    hasVoted();
}
// will combine this with VoteUp and then delete
function hasVoted(){
    let allCookies = document.cookie.split("=")
    console.log(allCookies)
    if(allCookies[0] == 'voted'){
        // document.getElementById("cookie_alert").innerText = "Cookie present";
        document.getElementById("vote_up").classList.add("visually-hidden")
    }
    else{
        console.log("no cookie")
        document.getElementById("vote_up").classList.remove("visually-hidden");
 
    }
}

// Random movie selector
document.getElementById("randomMovieForm").addEventListener("submit", searchRandomName);


// Creating the movie card from the array given in the 
function createMovieCard(){
const card = document.createElement("div"); 
  card.setAttribute("class", "card")
  card.style.width = "22rem"; 
  card.style.margin = "5px"

  
  document.getElementById("card-container").appendChild(card); // Display the card in the container div

  let index = (movieData.length - 1);
  const filmPoster = movieData[index].Poster;
  const filmActors = movieData[index].Actors;
  const filmTitle = movieData[index].Title;
  const filmRating = movieData[index].imdbRating;
  const filmGenre = movieData[index].Genre;
  const filmPlot = movieData[index].Plot;
  const filmYear = movieData[index].Released;


  const cardPoster = document.createElement("img"); 
  cardPoster.setAttribute("class", "card-img-top");
  cardPoster.setAttribute("src", filmPoster);
  card.appendChild(cardPoster);
  
  const infoContainer = document.createElement("div");
  infoContainer.setAttribute("class", "card-body");
  card.appendChild(infoContainer);

  const cardTitle = document.createElement("h3");
  cardTitle.setAttribute("class", "card-title");
  cardTitle.innerText = filmTitle;
  infoContainer.appendChild(cardTitle);

  const cardActors = document.createElement("h6");
  cardActors.setAttribute("class", "card-title");
  cardActors.innerText = filmActors;
  infoContainer.appendChild(cardActors);

  const cardYear = document.createElement("h7");
  cardYear.setAttribute("class", "card-subtitle");
  cardYear.innerText = filmYear;
  infoContainer.appendChild(cardYear);

  const cardGenre = document.createElement("p");
  cardGenre.setAttribute("class", "card-subtitle mb-2 text-muted");
  cardGenre.innerText = filmGenre;
  infoContainer.appendChild(cardGenre);

  const cardPlot = document.createElement("p");
  cardPlot.setAttribute("class", "card-text lead");
  cardPlot.innerText = filmPlot;
  infoContainer.appendChild(cardPlot);

  const cardRating = document.createElement("p");
  cardRating.setAttribute("class", "card-title");
  cardRating.innerText =`Rating: ${filmRating}`;
  infoContainer.appendChild(cardRating);

  const cardTrailer = document.createElement("a");
  cardTrailer.setAttribute("href","https://www.youtube.com/watch?v=keYOX0Fp_BQ" );
  cardTrailer.setAttribute("target", "_blank");
  cardTrailer.setAttribute("class", "btn btn-success");
  cardTrailer.innerText = "Trailer";
  infoContainer.appendChild(cardTrailer);
}

function searchRandomName(evt) {
    evt.preventDefault();

    let random_api_url = "https://k2maan-moviehut.herokuapp.com/api/random"
    fetch(random_api_url)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        getMovieData({
            movie_title_input: data.name,
            movie_release_year: ""
        })
    })
}

function getMovieTrailer() {

    // Get movie ID
    let index = (movieData.length - 1);
    let imdb_id = movieData[index].imdbID

    // use that ID to search for youTube trailer
    let api_moviedb_api_url = `https://api.themoviedb.org/3/movie/${imdb_id}/videos?api_key=${secret_key_imdb}&language=en-US`
    fetch(api_moviedb_api_url)
    .then(function (response){
        return response.json();
    })
    .then(function (data1){
        console.log(`https://www.youtube.com/watch?v=${data1.results[0].key}`);
    })
}