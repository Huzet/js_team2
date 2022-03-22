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
import { secret_key } from "./modules/api_keys.js"
let movieData = [];

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