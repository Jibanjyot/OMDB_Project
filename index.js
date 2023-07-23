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
        <img src="${movie.Poster}" alt="${movie.Title}" width="100" >
        <p>${movie.Title}</p>
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
            <div>
                <h1>${data.Title}</h1>
                <div>${data.Released} --- R --- ${data.Runtime}</div>
                <div> <img src="${data.Poster}" /> </div>
                <div><p>${data.Genre}</p></div>
                <div><p>${data.Plot}</p></div>
                <div><p>${data.Director}</p></div>
                <div><p>${data.Writer}</p></div>
                <div><p>${data.Actors}</p></div>
            </div>
            <input type="text" id="commentInputText" placeholder="Enter Comment" />
            <button id="addCommentButton" onclick="addComment('${movieId}')">Add Comment</button>
            <button id="viewCommentButton" onclick="displayComment('${movieId}')">View Comments</button>
            <div id="commentListContainer">`;

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
    saveComment(commentInputText,movieId);
}


function saveComment(commentInputText,movieId) {
    commentList.push({ movie_id:movieId,text: commentInputText });
    localStorage.setItem("comments", JSON.stringify(commentList));
    displayComment(movieId);
}

function displayComment(movieId) {
    let commentListContainer = document.getElementById("commentListContainer");
    commentListContainer.innerHTML = "";
    let commentListtoDisplay = commentList.filter(comment => comment.movie_id === movieId);
    commentListtoDisplay.forEach(comment => {
        const newCommentElement = document.createElement('div');
        newCommentElement.textContent = comment.text;
        commentListContainer.appendChild(newCommentElement);
    });
}



