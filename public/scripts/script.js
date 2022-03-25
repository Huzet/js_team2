// variables
const movieData = [];
const ctxRating = document.getElementById("movieRating").getContext("2d");
const ctxVote = document.getElementById("movieVote").getContext("2d");
let myRatingChart = undefined;
let myVoteChart = undefined;
let flipFlag = true;

// Search Bar

// Button Listener
document
  .getElementById("searchMovieForm")
  .addEventListener("submit", searchMovieButtonPress);

function searchMovieButtonPress(evt) {
  evt.preventDefault();
  const movie_title_input = evt.target.elements[1].value.replace(/ /g, "+");
  const movie_release_year = evt.target.elements[2].value;

  getMovieData({ movie_title_input, movie_release_year });
}

function getMovieData({ movie_title_input, movie_release_year }) {
  let node_server_link;

  if (movie_release_year.length < 1) {
    // BEFORE PUSH RECOMMENT OUT LOCALHOST
    //node_server_link = `http://localhost:3000/request?movie_title=${movie_title_input}`;
    node_server_link = `https://movie-voter.herokuapp.com/request?movie_title=${movie_title_input}`;
  } else {
    // node_server_link = `http://localhost:3000/request?movie_title=${movie_title_input}&movie_year=${movie_release_year}`;
    node_server_link = `https://movie-voter.herokuapp.com/request?movie_title=${movie_title_input}&movie_year=${movie_release_year}`;
  }

  fetch(node_server_link)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.Response == "False") {
        console.log("I dont have that movie displaying banner");
        document.getElementById("movie_not_found_alert").innerText =
          "Movie not found please try again";
      } else {
        document.getElementById("movie_not_found_alert").innerText = "";
        movieData.push(data);
        getMovieTrailer();
        createMovieCard();
      }
    });
}

// Random movie selector
document
  .getElementById("randomMovieForm")
  .addEventListener("submit", searchRandomName);

function searchRandomName(evt) {
  evt.preventDefault();

  // let random_api_url = "http://localhost:3000/random"
  let random_api_url = "https://movie-voter.herokuapp.com/random";
  fetch(random_api_url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getMovieData({
        movie_title_input: data.name,
        movie_release_year: "",
      });
    });
}

function getMovieTrailer() {
  // Get movie ID
  let index = movieData.length - 1;
  let imdb_id = movieData[index].imdbID;

  // use that ID to search for youTube trailer
  let api_moviedb_api_url = `http://localhost:3000/trailer?imdbid=${imdb_id}`;
  //let api_moviedb_api_url = `https://movie-voter.herokuapp.com/trailer?imdbid=${imdb_id}`
  fetch(api_moviedb_api_url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data1) {
      console.log(`https://www.youtube.com/watch?v=${data1.results[0].key}`);
      movieData[index][
        "trailer_link"
      ] = `https://www.youtube.com/watch?v=${data1.results[0].key}`;
      console.log(movieData[index].trailer_link);
    });
}

// Creating the movie card from the array given from the API
function createMovieCard() {
  // creating variables for use in the function
  let index = movieData.length - 1;
  const filmPoster = movieData[index].Poster;
  const filmActors = movieData[index].Actors;
  const filmTitle = movieData[index].Title;
  const filmGenre = movieData[index].Genre;
  const filmPlot = movieData[index].Plot;
  const filmYear = movieData[index].Released;

  // Each time we create a card, we need to add it to the larger container holding all of our cards.
  const totalCardContainer = document.createElement("div");
  document.getElementById("card-container").appendChild(totalCardContainer);

  const flipCardContainer = document.createElement("div");
  flipCardContainer.setAttribute("class", "card");
  totalCardContainer.appendChild(flipCardContainer);

  // Building the flip card and it's front and back
  // Adding Event Listeners to both the front and back
  const flipFront = document.createElement("div");
  flipFront.setAttribute("class", "card_inner topCard");
  flipCardContainer.appendChild(flipFront);
  flipFront.addEventListener("click", flip);

  const flipBack = document.createElement("div");
  flipBack.setAttribute("class", "card_inner bottomCard");
  flipCardContainer.appendChild(flipBack);
  flipBack.addEventListener("click", flip);

  // Adding the front card then putting the poster, title, and year on it.
  const flipCardFront = document.createElement("div");
  flipCardFront.setAttribute("class", "card_front");
  flipFront.appendChild(flipCardFront);

  const cardPoster = document.createElement("img");
  cardPoster.setAttribute("class", "posterSize");
  cardPoster.setAttribute("src", filmPoster);
  flipCardFront.appendChild(cardPoster);

  const cardTitle = document.createElement("h2");
  cardTitle.setAttribute("id", "movieCardTitle");
  cardTitle.innerText = filmTitle;
  flipCardFront.appendChild(cardTitle);

  const cardYear = document.createElement("h4");
  cardYear.setAttribute("id", "movieYear");
  cardYear.innerText = filmYear;
  flipCardFront.appendChild(cardYear);

  // Adding the back card then putting the actors, plot, and genre on the back.
  const flipCardBack = document.createElement("div");
  flipCardBack.setAttribute("class", "card_back");
  flipBack.appendChild(flipCardBack);

  const cardActors = document.createElement("h3");
  cardActors.style.fontSize = "24px";
  cardActors.style.margin = "7px";
  cardActors.style.marginTop = "10%";
  cardActors.style.marginBottom = "10%";
  cardActors.style.color = "white";
  cardActors.style.fontWeight = "bold";
  cardActors.style.textAlign = "center";
  cardActors.innerText = filmActors;
  flipCardBack.appendChild(cardActors);

  const flipCardBackPara = document.createElement("p");
  flipCardBackPara.style.fontSize = "20px";
  flipCardBackPara.style.margin = "7px";
  flipCardBackPara.style.marginTop = "10%";
  flipCardBackPara.style.color = "#e9c46a";
  flipCardBackPara.style.fontStyle = "italic";
  flipCardBackPara.style.textAlign = "center";
  flipCardBackPara.innerText = filmPlot;
  flipCardBack.appendChild(flipCardBackPara);

  const flipCardBackGenre = document.createElement("p");
  flipCardBackGenre.style.fontSize = "15px";
  flipCardBackGenre.style.margin = "7px";
  flipCardBackGenre.style.marginTop = "5%";
  flipCardBackGenre.style.marginBottom = "10%";
  flipCardBackGenre.style.color = "white";
  flipCardBackGenre.style.textAlign = "center";
  flipCardBackGenre.innerText = filmGenre;
  flipCardBack.appendChild(flipCardBackGenre);

  //Adding buttons to the bottom of each card
  const cardTrailer = document.createElement("a");
  cardTrailer.setAttribute("class", "btn btn-primary");
  cardTrailer.setAttribute("id", index);
  cardTrailer.setAttribute("type", "submit");
  cardTrailer.style.width = "33%";
  cardTrailer.onclick = button_action_trailer;
  cardTrailer.innerText = "Trailer";
  totalCardContainer.appendChild(cardTrailer);

  const cardLikeButton = document.createElement("a");
  cardLikeButton.setAttribute("class", "btn btn-success");
  cardLikeButton.setAttribute("type", "submit");
  cardLikeButton.onclick = like_button_press;
  cardLikeButton.innerHTML = '<i class="bi bi-hand-thumbs-up-fill">0</i>';
  cardLikeButton.style.width = "33%";
  totalCardContainer.appendChild(cardLikeButton);

  const cardDeleteButton = document.createElement("a");
  cardDeleteButton.setAttribute("class", "btn btn-danger");
  cardDeleteButton.setAttribute("type", "submit");
  cardDeleteButton.onclick = delete_button_press;
  cardDeleteButton.innerHTML = "Delete";
  cardDeleteButton.style.width = "33%";
  totalCardContainer.appendChild(cardDeleteButton);

  const cardLikeButtonSmall = document.createElement("p");
  cardLikeButtonSmall.innerHTML = "";
  totalCardContainer.appendChild(cardLikeButtonSmall);

  drawBarChart({
    dataArr: getBoxOffice(),
    labelsArr: getTitle(),
    bgColorsArr: generateRandomColors({
      howMany: movieData.length,
    }),
    borderColorsArr: generateRandomColors({
      howMany: movieData.length,
    }),
  });
  drawDoughnutChart({
    dataArr: getRating(),
    labelsArr: getTitle(),
    bgColorsArr: generateRandomColors({
      howMany: movieData.length,
    }),
  });
}

// Going to swap classes from top to bottom and vice versa
function toggleClasses(elt) {
  if (elt.classList.contains("topCard")) {
    elt.classList.replace("topCard", "bottomCard");
  } else {
    elt.classList.replace("bottomCard", "topCard");
  }
}

// This function flips when the card is clicked.
function flip(e) {
  const elt = e.currentTarget;
  const eltNextSibling = elt.nextSibling;
  const eltPreviousSibling = elt.previousSibling;

  elt.style.transform = "rotateY(-360deg)";
  toggleClasses(elt);

  if (eltNextSibling !== null) {
    toggleClasses(eltNextSibling);
  } else {
    toggleClasses(eltPreviousSibling);
  }
}

function getTitle() {
  const titleArr = [];
  for (let index = 0; index < movieData.length; index++) {
    titleArr[index] = movieData[index].Title;
  }
  return titleArr;
}

function getRating() {
  const ratingArr = [];
  for (let index = 0; index < movieData.length; index++) {
    ratingArr[index] = movieData[index].imdbRating;
  }
  return ratingArr;
}

function getBoxOffice() {
  const boxOfficeArr = [];
  for (let index = 0; index < movieData.length; index++) {
    boxOfficeArr[index] = Number(
      movieData[index].BoxOffice.replace(/[^0-9.-]+/g, "")
    );
  }
  console.log(boxOfficeArr);
  return boxOfficeArr;
}

// bar chart for rating
function drawBarChart({ dataArr, labelsArr, bgColorsArr, borderColorsArr }) {
  if (myRatingChart !== undefined) {
    myRatingChart.destroy();
  }
  myRatingChart = new Chart(ctxRating, {
    type: "bar",
    data: {
      labels: labelsArr,
      datasets: [
        {
          label: "Movie Rating",
          data: dataArr,
          backgroundColor: bgColorsArr,
          borderColor: borderColorsArr,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// doughnut chart for vote
function drawDoughnutChart({ dataArr, labelsArr, bgColorsArr }) {
  if (myVoteChart !== undefined) {
    myVoteChart.destroy();
  }
  myVoteChart = new Chart(ctxVote, {
    type: "doughnut",
    data: {
      labels: labelsArr,
      datasets: [
        {
          label: "Box Office",
          data: dataArr,
          backgroundColor: bgColorsArr,
          hoverOffset: 4,
        },
      ],
    },
  });
}

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

function toggleClasses(elt) {
  // Going to swap classes from top to bottom and vice versa
  if (elt.classList.contains("topCard")) {
    elt.classList.replace("topCard", "bottomCard");
  } else {
    elt.classList.replace("bottomCard", "topCard");
  }
}

function flip(e) {
  // transform: rotateY(-180deg);
  const elt = e.currentTarget;
  //   const parentElt = e.target.parentElement;
  const eltNextSibling = elt.nextSibling;
  const eltPreviousSibling = elt.previousSibling;

  elt.style.transform = "rotateY(-360deg)";
  //   if (eltNextSibling !== null) {
  //     eltNextSibling.style.transform = "rotateY(-180deg)";
  //   } else {
  //     eltPreviousSibling.style.transform = "rotateY(-180deg)";
  //   }
  toggleClasses(elt);

  if (eltNextSibling !== null) {
    toggleClasses(eltNextSibling);
  } else {
    toggleClasses(eltPreviousSibling);
  }
}

function button_action_trailer(evt) {
  let index = parseInt(evt.target.id);
  let movieTrailer = movieData[index].trailer_link;
  console.log("Movie trailer: " + movieTrailer);
  window.open(movieTrailer, "_blank");
}

// ADD TO NEW BRANCH
function like_button_press(evt) {
  let votes = parseInt(evt.target.children[0].innerText);
  let allCookies = document.cookie.split("=");

  if (allCookies[0] == "voted") {
    evt.target.parentElement.children[4].innerText = "You already voted";
  } else {
    votes++;
    evt.target.children[0].innerText = votes;
    document.cookie = "voted=yes; SameSite=None; Secure; max-age=8";
    evt.target.parentElement.children[4].innerText = "Vote Accepted";
  }
}

function getMovieTitles() {
  let movie_titles_html = document.querySelectorAll("#movieCardTitle");
  let movie_titles = [];
  for (let count = 0; count < movie_titles_html.length; count++) {
    let title = movie_titles_html[count].innerText;
    // console.log(count)
    movie_titles.push(title);
  }
  return movie_titles;
}

document
  .getElementById("list_movies")
  .addEventListener("submit", pasteToClipBoard);

function pasteToClipBoard(evt) {
  evt.preventDefault();
  let movie_titles = getMovieTitles().join(", ");
  console.log(movie_titles);
  navigator.clipboard.writeText(movie_titles);
  alert(movie_titles);
}

function delete_button_press(evt) {
  console.log("I work");
  evt.target.parentElement.remove();
}
