const api_key = 'cc8f2ea4';
const api_url = 'https://www.omdbapi.com/';

const movieListElement = document.getElementById('movieList');
const searchButton = document.getElementById("searchButton");
const paginationBar = document.getElementById('pagination');


searchButton.onclick = async function () {
    const searchBox = document.getElementById('movieSearch');
    const query = searchBox.value.trim();
    let movies = await fetchMovies(query,1);
    totalItems = movies.totalResults;
    console.log(totalItems);
    movies = movies.Search || [];
    displayMovieList(movies);
    createPaginationBar(totalItems, 10,query);
}

function createPaginationBar(totalItems, itemsPerPage,query) {
    paginationBar.innerHTML = "";
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<span class="pageNumber" onclick="goToPage('${query}',${i})" id="page${i}"><a>${i}</a></span>`;
    }
    paginationBar.innerHTML = paginationHTML;
}

async function goToPage(query,i){
    let movies = await fetchMovies(query,i);
    movies = movies.Search || [];
    displayMovieList(movies);
    const paginationNumber = document.getElementById(`page${i}`);
    paginationNumber.style.color = "blue";
}


async function fetchMovies(query,pageNumber) {
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
        movieItem.addEventListener('click', () => showMovieDetails(movie.imdbID));
        movieListElement.appendChild(movieItem);
    });
}


async function showMovieDetails(movieId) {
    const response = await fetch(`${apiUrl}?apikey=${apiKey}&i=${movieId}`);
    const data = await response.json();
  
    // Display movie details in the movieDetails element
    const movieDetailsElement = document.getElementById('movieDetails');
    movieDetailsElement.innerHTML = `
      <h2>${data.Title}</h2>
      <p>Director: ${data.Director}</p>
      <p>Actors: ${data.Actors}</p>
      <p>Plot: ${data.Plot}</p>
    `;
  }