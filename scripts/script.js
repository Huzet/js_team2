// variables 
import { secret_key } from "./modules/api_keys.js"
let movieData = [];
let myCookie;

const ctx = document.getElementById('myCanvas').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Movie1', 'Movie2', 'Movie3'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3],
            backgroundColor: [
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
    // http://www.omdbapi.com/?t=indiana+jones&apikey=44662e28
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
}

// Will delete once we place cookie. Cookie will be placed to see if user has voted
document.getElementById("cookie").addEventListener("submit", cookieCreater)
function cookieCreater(evt){
    evt.preventDefault();
    console.log("cookie");
    // Cookie exists only for 30 sec
    document.cookie = "voted=yes; SameSite=None; Secure; max-age=30";
    hasVoted();
}

document.getElementById("check_cookie").addEventListener("submit", checkCookies)
function checkCookies(evt){
    evt.preventDefault();
    hasVoted();
}

function hasVoted(){
    let allCookies = document.cookie.split("=")
    console.log(allCookies)
    if(allCookies[0] == 'voted'){
        document.getElementById("cookie_alert").innerText = "Cookie present";
        document.getElementById("cookie").classList.add("visually-hidden")
    }
    else{
        console.log("no cookie")
        document.getElementById("cookie_alert").innerText = "";
        document.getElementById("cookie").classList.remove("visually-hidden");
 
    }
}



// Getting the form input value from the movie title
const title = document.getElementById("movie_title").value;


// Creating the movie card with the information given
function createMovieCard(title){
const card = document.createElement("div"); 
  
  card.classList.add("card");

  card.style.width = "18rem"; // the width of this card div is 18 rem units

  
  document.getElementById("cards_container").appendChild(card); // Display the card in the container div

 // creating the image from the destination provided. 
 //if there is no destination given, we will retrieve a random unsplash photo
  const cardPoster = document.createElement("img"); 
  cardImage.setAttribute("class", "card-img-top");

// Retrieving the info from the api //
const movieUrl= `https://www.omdbapi.com/?t=${title}}&apikey=44662e28`;
    fetch(movieUrl)
    .then((response) => response.json())   
    .then((data) => {
    const filmPoster= (data["Poster"]); 
    const filmActors= (data["Actors"]) 
    const filmTitle= (data["Title"]) 
    const filmGenre= (data["Genre"]) 
    const filmPlot= (data["Plot"]) 
    const filmRating= (data["imdbRating"]) 
    console.log(filmPoster, filmActors, filmTitle, filmGenre, filmPlot, filmRating)
    

  });
  cardPoster.setAttribute("src", filmPoster);
  
  const infoContainer = document.createElement("div");
  infoContainer.setAttribute("class", "card-body");

  const cardTitle = document.createElement("h3")
  cardTitle.setAttribute("class", "card-title");
  cardTitle.innerText = filmTitle;
  infoContainer.appendChild(cardTitle);

  const cardActors = document.createElement("h5")
  cardTitle.setAttribute("class", "card-title");
  cardTitle.innerText = filmActors;
  infoContainer.appendChild(cardActors);

  const cardGenre = document.createElement("h6")
  cardTitle.setAttribute("class", "card-title");
  cardTitle.innerText = filmGenre;
  infoContainer.appendChild(cardGenre);

  const cardRating = document.createElement("h6")
  cardTitle.setAttribute("class", "card-title");
  cardTitle.innerText =`Rating: ${filmRating}`;
  infoContainer.appendChild(cardRating);

  const cardPlot = document.createElement("p")
  cardTitle.setAttribute("class", "card-text");
  cardTitle.innerText = filmPlot;
  infoContainer.appendChild(cardPlot);
}