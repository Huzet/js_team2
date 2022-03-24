// variables 
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
        // BEFORE PUSH RECOMMENT OUT LOCALHOST
        //node_server_link = `http://localhost:3000/request?movie_title=${movie_title_input}`;
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
        if (data.Response == "False"){
            console.log("I dont have that movie displaying banner")
            document.getElementById("movie_not_found_alert").innerText = "Movie not found please try again"
        }
        else{
            document.getElementById("movie_not_found_alert").innerText = ""
            movieData.push(data);
            getMovieTrailer();
            createMovieCard();       
        }
    })
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
    let api_moviedb_api_url = `http://localhost:3000/trailer?imdbid=${imdb_id}`
    //let api_moviedb_api_url = `https://movie-voter.herokuapp.com/trailer?imdbid=${imdb_id}`
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
    let index = (movieData.length - 1);
    const filmPoster = movieData[index].Poster;
    const filmActors = movieData[index].Actors;
    const filmTitle = movieData[index].Title;
    const filmRating = movieData[index].imdbRating;
    const filmGenre = movieData[index].Genre;
    const filmPlot = movieData[index].Plot;
    const filmYear = movieData[index].Released;

    const totalCardContainer = document.createElement("div"); 
    document.getElementById("card-container").appendChild(totalCardContainer);

    const flipCardContainer = document.createElement("div"); 
    flipCardContainer.setAttribute("class", "card")
    totalCardContainer.appendChild(flipCardContainer);
    
    // Building the flip card and it's front and back
    const flipCard = document.createElement("div")
    flipCard.setAttribute("class", "card_inner")
    flipCardContainer.appendChild(flipCard);

    const flipBack = document.createElement("div")
    flipBack.setAttribute("class", "card_inner")
    flipCardContainer.appendChild(flipBack);

    const flipCardFront = document.createElement("div");
    flipCardFront.setAttribute("class", "card_front");
    flipCard.appendChild(flipCardFront);

    const cardPoster = document.createElement("img"); 
    cardPoster.setAttribute("class", "posterSize")
    cardPoster.setAttribute("src", filmPoster);
    flipCardFront.appendChild(cardPoster);
   
    const cardTitle = document.createElement("h2");
    cardTitle.setAttribute("id", "movieCardTitle")
    cardTitle.innerText = filmTitle;
    flipCardFront.appendChild(cardTitle);

    const cardYear = document.createElement("h4");
    cardYear.setAttribute("id", "movieYear")
    cardYear.innerText = filmYear;
    flipCardFront.appendChild(cardYear);


    // Adding the button to the totalCardContainer
    const cardTrailer = document.createElement("a");
    cardTrailer.setAttribute("class", "btn btn-success");
    cardTrailer.setAttribute("id", index)
    cardTrailer.setAttribute("type", "submit")
    cardTrailer.onclick = button_action_trailer;
    cardTrailer.innerText = "Trailer";
    totalCardContainer.appendChild(cardTrailer);

    // ADD TO NEW BRANCH
    const cardLikeButton = document.createElement("a");
    cardLikeButton.setAttribute("class", "btn btn-success");
    cardLikeButton.setAttribute("type", "submit")
    cardLikeButton.onclick = like_button_press;
    cardLikeButton.innerHTML = '<i class="bi bi-hand-thumbs-up-fill">0</i>';
    totalCardContainer.appendChild(cardLikeButton);

    const cardLikeButton1 = document.createElement("a");
    cardLikeButton1.setAttribute("class", "btn btn-danger");
    cardLikeButton1.setAttribute("type", "submit")
    cardLikeButton1.onclick = delete_button_press;
    cardLikeButton1.innerHTML = 'Delete';
    totalCardContainer.appendChild(cardLikeButton1);

    const cardLikeButtonSmall = document.createElement("p");
    cardLikeButtonSmall.innerHTML = "";
    totalCardContainer.appendChild(cardLikeButtonSmall);
    // 


    
    const flipCardBack = document.createElement("div")
    flipCardBack.setAttribute("class", "card_back outline ")
    flipBack.appendChild(flipCardBack);
    
    const flipCardBackPara = document.createElement("p")
    flipCardBackPara.style.fontSize = "10px";
    flipCardBackPara.innerText = filmPlot;
    flipCardBack.appendChild(flipCardBackPara);
    // const flipCardBackContent = document.createElement("div");
    // flipCardBackContent.setAttribute("class", "card_content");
    // flipCardBack.appendChild(flipCardBackContent);

    // const flipCardBackBody = document.createElement("div ");
    // flipCardBackBody.setAttribute("class", "card_body")

    //   const cardActors = document.createElement("h5");
    //   cardActors.setAttribute("class", "modal-title");
    //   cardActors.setAttribute("id", "exampleModalLabel")
    //   cardActors.innerText = "filmActors";
    //   modeHeader.appendChild(cardActors);

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

function button_action_trailer(evt){
    let index = parseInt(evt.target.id);
    let movieTrailer =  movieData[index].trailer_link
    console.log("Movie trailer: " + movieTrailer)
    window.open(movieTrailer, "_blank");
        }

// ADD TO NEW BRANCH
function like_button_press(evt){
    let votes = parseInt(evt.target.children[0].innerText);
    let allCookies = document.cookie.split("=")

    if(allCookies[0] == 'voted'){
        evt.target.parentElement.children[3].innerText = "You already voted";
    }
    else{
        votes++;
        evt.target.children[0].innerText = votes;
        document.cookie = "voted=yes; SameSite=None; Secure; max-age=8";
        evt.target.parentElement.children[3].innerText = "Vote Accepted";
    }
}

function getMovieTitles(){
    let movie_titles_html = document.querySelectorAll("#movieCardTitle")
    let movie_titles = [];
    for (let count = 0; count < movie_titles_html.length; count++){
        let title = movie_titles_html[count].innerText;
        // console.log(count)
        movie_titles.push(title)
         
    }
    return movie_titles;
}

document.getElementById("list_movies").addEventListener("submit", pasteToClipBoard);

function pasteToClipBoard(evt){
    evt.preventDefault();
    let movie_titles = getMovieTitles().join(", ")
    console.log(movie_titles)
    navigator.clipboard.writeText(movie_titles)
    alert(movie_titles)

}

function delete_button_press(evt){
    console.log("I work");
    evt.target.parentElement.remove();
}