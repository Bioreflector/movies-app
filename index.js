const myApiKey = "?api_key=0173d6afde5e852201a2850602f70181"
// const urlForMovies = "https://api.themoviedb.org/3/movie/top_rated"
const urlForGanres = "https://api.themoviedb.org/3/genre/movie/list"
const imgurl = "https://image.tmdb.org/t/p/w500/"
const moviesContainer = document.querySelector('.movies-colection-wrapper')
const watchListBtn = document.querySelector('.watch-list-btn')
watchListBtn.addEventListener('click' , init)

const searchForm = document.searchMovieForm
const {searchInput , searchBtn} = searchForm

searchBtn.addEventListener('click' , showSerchedMovies)

async function getSerchedMovies(value){
    const response = await fetch(`https://api.themoviedb.org/3/search/movie${myApiKey}&language=en-US&query=${value}`)
    const movies = await response.json()
    const {results} = movies
    return results
   
}

async function showSerchedMovies(event){
    event.preventDefault()
    const value = searchInput.value
    const movies = await getSerchedMovies(value)
    const genres = await getGenres()
    rander(movies , genres)
}

async function getGenres(){
    const response = await fetch(`${urlForGanres}${myApiKey}`)
    const result = await response.json()
    const {genres} = result
    return genres

}

async function getMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated${myApiKey}`)
    const movies = await response.json()
    const {results} = movies
    return results
}

async function init(){
    moviesContainer.classList.remove('show-about-movie')
    const movies = await getMovies()
    const genres = await getGenres()
    console.log(movies)
    rander(movies , genres)
}



function createMoviCard(movie , genres){
    const movieCard = document.createElement('div')
    movieCard.classList.add('movie-card')
    const imgBox = document.createElement('div')
    imgBox.classList.add('movie-card-img-box')
    imgBox.innerHTML = `<img src ="${imgurl}${movie.backdrop_path}" alt ="movieImg">`
    movieCard.appendChild(imgBox)
    const infBox = document.createElement('div')
    infBox.classList.add('movie-card-inf-box')
    movieCard.appendChild(infBox)
    const moviTitle = document.createElement('h3')
    moviTitle.innerText = `${movie.title}`
    moviTitle.addEventListener('click' , ()=> rander(movie , genres))
    moviTitle.addEventListener('click' , showAboutMovie)
    infBox.appendChild(moviTitle)
    const movieGanre = document.createElement('div')
    movieCard.classList.add("movie-Ganre")
    const genreArr = selectGenre(movie , genres)
    movieGanre.innerHTML = `<p>Ganre: ${createGanres(genreArr)}</p>`
    infBox.appendChild(movieGanre)
    return movieCard

}
function showAboutMovie(){
    moviesContainer.classList.add('show-about-movie')
}

function createGanres(genreArr){
    const genreList = genreArr.map(genre => `<span>${genre.name}</span>`).join(" , ")
    return genreList
}

function selectGenre(movie , genres){
    const genreList = genres.filter(genre => movie.genre_ids.includes(genre.id))
    return genreList
}
function ensureArray(arr) {
    return Array.isArray(arr) ? arr : [arr]
}

function rander(movie , genres){
    moviesContainer.innerText = ""
    const moviesArr = ensureArray(movie)
    const moviesList = moviesArr.map(movie => createMoviCard(movie , genres))
    moviesList.forEach(movie => moviesContainer.appendChild(movie))
}

init()

