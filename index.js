const api_key = 'cc8f2ea4';
const api_url = 'https://www.omdbapi.com/';

const movieListElement = document.getElementById('movieList');
const searchButton = document.getElementById("searchButton");
const paginationBar = document.getElementById('pagination');


searchButton.onclick = async function () {
    const searchBox = document.getElementById('movieSearch');
    const query = searchBox.value.trim();
    let movies = await fetchMovies(query, 1);
    totalItems = movies.totalResults;
    console.log(totalItems);
    movies = movies.Search || [];
    displayMovieList(movies);
    createPaginationBar(totalItems, 10, query);
}

function createPaginationBar(totalItems, itemsPerPage, query) {
    paginationBar.innerHTML = "";
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<span class="pageNumber" onclick="goToPage('${query}',${i})" id="page${i}"><a>${i}</a></span>`;
    }
    paginationBar.innerHTML = paginationHTML;
}

async function goToPage(query, i) {
    let movies = await fetchMovies(query, i);
    movies = movies.Search || [];
    displayMovieList(movies);
    const paginationNumber = document.getElementById(`page${i}`);
    paginationNumber.style.color = "blue";
}


async function fetchMovies(query, pageNumber) {
    const response = await fetch(`${api_url}?apikey=${api_key}&s=${query}&page=${pageNumber}`);
    console.log(`${api_url}?apikey=${api_key}&s=${query}`);
    const data = await response.json();
    return data;
}


function displayMovieList(movies) {
    movieListElement.innerHTML = '';

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.id = movie.imdbID;
        movieItem.classList.add("movie-card")
        movieItem.innerHTML = `
        <img src="${movie.Poster}" alt="${movie.Title} Poster">
        <div class="movie-info">
            <h2>${movie.Title}</h2>
            <p><strong>Year:</strong> ${movie.Year}</p>
        </div>
      `;
        movieListElement.appendChild(movieItem);
        movieItem.addEventListener('click', () => showMovieDetails(movie.imdbID));
    });
}


async function showMovieDetails(movieId) {
    const response = await fetch(`${api_url}?apikey=${api_key}&i=${movieId}`);
    const data = await response.json();

    // Display movie details in the movieDetails element
    const movieDetailsElement = document.getElementById('movieDetails');
    movieDetailsElement.style.display = "flex";
    movieDetailsElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    movieDetailsElement.innerHTML = `
        <div class="movie-details-container">
            <img src="${data.Poster}" alt="${data.Title}">
            <div class="movie-details-info-container">
                <h2>${data.Title}</h2>
                <p>Year:${data.Year}</p>
                <p>Genre: ${data.Genre}</p>
                <p>Director: ${data.Director}</p>
                <p>Plot:${data.Plot}</p>
                <div id="userRatingSection">
                    <h3>User Rating</h3>
                    <p>Average Rating: ${data.imdbRating}</p>
                    <p>User Rating:<span id='averageUserRating'></span></p>
                    <input type="number" id="userRating" min="1" max="5">
                    <button id="submitRating" onclick="saveAndDisplayRating('${movieId}')">Submit Rating</button>
                </div>
            </div>
        </div>
        <div class="comment-container">
            <input type="text" id="commentInputText" placeholder="Enter Comment" />
            <button id="addCommentButton" onclick="addComment('${movieId}')">Add Comment</button>
            <button id="viewCommentButton" onclick="displayComment('${movieId}')">View Comments</button>
            
        </div>
        
        <div id="commentListContainer">
    `;
    
    displayRating(movieId);
}

let commentList = getcommentListFromLocalStorage();

function getcommentListFromLocalStorage() {
    let stringifiedCommentList = localStorage.getItem("comments");
    let parsedCommentList = JSON.parse(stringifiedCommentList);
    if (parsedCommentList === null) {
        return [];
    } else {
        return parsedCommentList;
    }
}




// add comment
function addComment(movieId) {
    console.log("add");
    let commentInputText = document.getElementById("commentInputText").value;
    saveComment(commentInputText, movieId);
}


function saveComment(commentInputText, movieId) {
    commentList.push({ movie_id: movieId, text: commentInputText });
    localStorage.setItem("comments", JSON.stringify(commentList));
    displayComment(movieId);
}

function displayComment(movieId) {
    let commentListContainer = document.getElementById("commentListContainer");
    commentListContainer.innerHTML = "";
    let commentListtoDisplay = commentList.filter(comment => comment.movie_id === movieId);
    commentListtoDisplay.forEach(comment => {
        const newCommentElement = document.createElement('div');
        newCommentElement.classList.add("comment-box-style");
        newCommentElement.textContent = comment.text;
        commentListContainer.appendChild(newCommentElement);
    });
}


let ratingList = getratingListFromLocalStorage();

function getratingListFromLocalStorage() {
    let stringifiedratingList = localStorage.getItem("ratings");
    let parsedratingList = JSON.parse(stringifiedratingList);
    if (parsedratingList === null) {
        return [];
    } else {
        return parsedratingList;
    }
}
function saveAndDisplayRating(movieId){
    let userRating = document.getElementById("userRating").value;
    ratingList.push({ movie_id: movieId, rating: userRating });
    localStorage.setItem("ratings", JSON.stringify(ratingList));
    displayRating(movieId);
}

function displayRating(movieId){
    let averageUserRating = document.getElementById("averageUserRating");
    averageUserRating.innerHTML = "";
    let ratingListtoDisplay = ratingList.filter(rating => rating.movie_id === movieId);
    let sum = 0;
    ratingListtoDisplay.forEach(rating => {
        sum = sum+Number(rating.rating);
    });
    sum = sum*100;
    averageUserRating.textContent = (Math.round(sum/(ratingListtoDisplay.length)))/100;
}