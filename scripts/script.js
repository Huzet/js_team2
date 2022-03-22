// variables 
import { secret_key } from "./modules/api_keys.js"
const movieData = [];
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

    console.log(movieData)
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