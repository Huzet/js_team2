// variables 
import { secret_key } from "./modules/api_keys.js"
import { secret_key_imdb } from "./modules/api_keys.js"
const movieData = [];
const ctxRating = document.getElementById('movieRating').getContext('2d');
const ctxVote = document.getElementById('movieVote').getContext('2d');
let myRatingChart = undefined;
let myVoteChart = undefined;

// Search Bar 

// Button Listener
document.getElementById("searchMovieForm").addEventListener("submit", searchMovieButtonPress);

function searchMovieButtonPress(evt) {
    evt.preventDefault();
    const movie_title_input = evt.target.elements[1].value.replace(/ /g,"+");;
    const movie_release_year = evt.target.elements[2].value;

    getMovieData({movie_title_input, movie_release_year});
}

function getMovieData({movie_title_input, movie_release_year}) {
    let node_server_link;

    if (movie_release_year.length < 1){
        // node_server_link = `http://localhost:3000/request?movie_title=${movie_title_input}`;
        node_server_link = `https://movie-voter.herokuapp.com/request?movie_title=${movie_title_input}`;
    }
    else {
        // node_server_link = `http://localhost:3000/request?movie_title=${movie_title_input}&movie_year=${movie_release_year}`;
        node_server_link = `https://movie-voter.herokuapp.com/request?movie_title=${movie_title_input}&movie_year=${movie_release_year}`;
    }

    fetch(node_server_link)
    .then(function (response){
        return response.json();
    })
    .then(function(data){
        movieData.push(data);
        getMovieTrailer();
        createMovieCard();
    })
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

    // let random_api_url = "http://localhost:3000/random"
    let random_api_url = "https://movie-voter.herokuapp.com/random"
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
    // let api_moviedb_api_url = `http://localhost:3000/trailer?imdbid=${imdb_id}`
    let api_moviedb_api_url = `https://movie-voter.herokuapp.com/trailer?imdbid=${imdb_id}`
    fetch(api_moviedb_api_url)
    .then(function (response){
        return response.json();
    })
    .then(function (data1){
        console.log(`https://www.youtube.com/watch?v=${data1.results[0].key}`);
        movieData[index]["trailer_link"] = `https://www.youtube.com/watch?v=${data1.results[0].key}`;
        console.log( movieData[index].trailer_link);
    })
}

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
      infoContainer.setAttribute("id", "movieInfoContainer")
      card.appendChild(infoContainer);
    
      const cardTitle = document.createElement("h3");
      cardTitle.setAttribute("class", "card-title");
      cardTitle.setAttribute("id", "movieCardTitle")
      cardTitle.innerText = filmTitle;
      infoContainer.appendChild(cardTitle);
    
      const cardYear = document.createElement("h7");
      cardYear.setAttribute("class", "card-subtitle");
      cardYear.setAttribute("id", "movieYear")
      cardYear.innerText = filmYear;
      infoContainer.appendChild(cardYear);
    
      // Creating modal button to show more information
      const cardModal = document.createElement("button");
      cardModal.setAttribute("type", "button");
      cardModal.setAttribute("id", "movieCardModal")
      cardModal.setAttribute("class", "btn btn-primary");
      cardModal.setAttribute("data-bs-toggle", "modal");
      cardModal.setAttribute("data-bs-target", "#movieModal");
      cardModal.innerText ="More Information"
      infoContainer.appendChild(cardModal);
    
      // Modal pop-up display
      const modePop = document.createElement("div")
      modePop.setAttribute("class", "modal fade");
      modePop.setAttribute("id", "movieModal");
      modePop.setAttribute("tabindex", "-1");
      modePop.setAttribute("aria-labelledby", "exampleModalLabel");
      modePop.setAttribute("aria-hidden","true");
      document.getElementById("card-container").appendChild(modePop);
    
    //   const modeDialogue = document.createElement("div")
    //   modeDialogue.setAttribute("class", "modal-dialogue");
    //   modePop.appendChild(modeDialogue);
    
    //   const modeContent = document.createElement("div")
    //   modeContent.setAttribute("class", "modal-content");
    //   modeDialogue.appendChild(modeContent);
    
    //   const modeHeader = document.createElement("div")
    //   modeContent.setAttribute("class", "modal-header");
    //   modeContent.appendChild(modeHeader);
    
    //   const cardActors = document.createElement("h5");
    //   cardActors.setAttribute("class", "modal-title");
    //   cardActors.setAttribute("id", "exampleModalLabel")
    //   cardActors.innerText = "filmActors";
    //   modeHeader.appendChild(cardActors);

    const cardTrailer = document.createElement("a");
    cardTrailer.setAttribute("href", movieData[index].trailer_link);
    cardTrailer.setAttribute("target", "_blank");
    cardTrailer.setAttribute("class", "btn btn-success");
    cardTrailer.innerText = "Trailer";
    infoContainer.appendChild(cardTrailer);

    drawBarChart({
        dataArr: getRating(),
        labelsArr: getTitle(),
        bgColorsArr: generateRandomColors({
            howMany: movieData.length
        }),
        borderColorsArr: generateRandomColors({
            howMany: movieData.length
        })
    })
    drawDoughnutChart({
        dataArr: getBoxOffice(),
        labelsArr: getTitle(),
        bgColorsArr: generateRandomColors({
            howMany: movieData.length
        })
    })
}

function getTitle() {
    const titleArr = []
    for (let index = 0; index < movieData.length; index++) {
        titleArr[index] = movieData[index].Title;
    }
    return titleArr;
}

function getRating() {
    const ratingArr = []
    for (let index = 0; index < movieData.length; index++) {
        ratingArr[index] = movieData[index].imdbRating;
    }
    return ratingArr;
}

function getBoxOffice() {
    const boxOfficeArr = []
    for (let index = 0; index < movieData.length; index++) {
        boxOfficeArr[index] = Number(movieData[index].BoxOffice.replace(/[^0-9.-]+/g,""));
    }
    console.log(boxOfficeArr);
    return boxOfficeArr;
}

// bar chart for rating
function drawBarChart({
    dataArr,
    labelsArr,
    bgColorsArr,
    borderColorsArr
}){
    if (myRatingChart !== undefined) {
        myRatingChart.destroy();
    }
    myRatingChart = new Chart(ctxRating, {
        type: 'bar',
        data: {
            labels: labelsArr,
            datasets: [{
                label: 'Movie Rating',
                data: dataArr,
                backgroundColor: bgColorsArr,
                borderColor: borderColorsArr,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
    })
}

// doughnut chart for vote
function drawDoughnutChart({
    dataArr,
    labelsArr,
    bgColorsArr
}){
    if (myVoteChart !== undefined) {
        myVoteChart.destroy();
    }
    myVoteChart = new Chart(ctxVote, {
        type: 'doughnut',
        data: {
            labels: labelsArr,
            datasets: [{
                label: 'Box Office',
                data: dataArr,
                backgroundColor: bgColorsArr,
                hoverOffset: 4
            }]
        }
    })
};

function generateRandomColors({ howMany }) {
    const randColors = [];
    for (let index = 0; index < howMany; index++) {
      const rangeOfColors = "0123456789ABCDEF";
      let color = "#";
  
      for (let index = 0; index < 6; index++) {
        const randIdx = Math.floor(Math.random() * rangeOfColors.length);
        color += rangeOfColors[randIdx];
      }
  
      randColors.push(color);
    }
    return randColors;
}