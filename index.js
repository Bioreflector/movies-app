const myApiKey = "?api_key=0173d6afde5e852201a2850602f70181"
// const urlForMovies = "https://api.themoviedb.org/3/movie/top_rated"
const urlForGanres = "https://api.themoviedb.org/3/genre/movie/list"
const imgurl = "https://image.tmdb.org/t/p/w500/"
const moviesContainer = document.querySelector('.movies-colection-wrapper')
const watchListBtn = document.querySelector('.watch-list-btn')
const backBtn = document.querySelector('.back-btn')
let watchListArray = []
let genresArray = []

watchListBtn.addEventListener('click' , randerWatchList)
watchListBtn.addEventListener('click' , () => backBtn.classList.add('back-btn-show'))
backBtn.addEventListener('click', ()=> backBtn.classList.remove('back-btn-show'))
backBtn.addEventListener('click', init)

const searchForm = document.searchMovieForm
const {searchInput , searchBtn} = searchForm

searchBtn.addEventListener('click' , showSerchedMovies)

async function getSerchedMovies(value){
    const response = await fetch(`https://api.themoviedb.org/3/search/movie${myApiKey}&language=en-US&query=${value}`)
    const movies = await response.json()
    const {results} = movies
    console.log(results)
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

function addMovieToWathList(movie){
    watchListArray.push(movie)
}
function removeMovieFromWatchList(movie){
    watchListArray = watchListArray.filter(item => item.id !== movie.id)
}
function isWatchListContainsMovie(movie){
    return watchListArray.find(watchlistMovie => watchlistMovie.id === movie.id)
}

function addOrRemoveMovie(movie){
   if(isWatchListContainsMovie(movie)){
        removeMovieFromWatchList(movie)
   }
   else{
    addMovieToWathList(movie)
   } 
}

async function getMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated${myApiKey}`)
    const movies = await response.json()
    const {results} = movies
    return results
}

async function init(){
    const movies = await getMovies()
    const genres = await getGenres()
    genresArray = genres
    rander(movies , genres)
}



function createMoviCard(movie , genres){
    const movieCard = document.createElement('div')
    movieCard.classList.add('movie-card')
    const imgBox = document.createElement('div')
    imgBox.classList.add('movie-card-img-box')
    imgBox.innerHTML = `<img src ="${imgurl}${movie.poster_path}" alt ="movieImg">`
    movieCard.appendChild(imgBox)
    const infBox = document.createElement('div')
    infBox.classList.add('movie-card-inf-box')
    movieCard.appendChild(infBox)
    const moviTitle = document.createElement('h3')
    moviTitle.innerText = `${movie.title}`
    const addMovieBtn = document.createElement('button')
    addMovieBtn.innerText = isWatchListContainsMovie(movie) ? 'Remove from Watch List' : 'Add to Watch List'
    addMovieBtn.addEventListener('click', ()=> addOrRemoveMovie(movie))
    addMovieBtn.addEventListener('click', () => renameBtnAddMovie(movie , addMovieBtn))
    addMovieBtn.classList.add('movie-card-btn')
    const readMoreBtn = document.createElement('button')
    readMoreBtn.addEventListener('click', ()=> console.log('test'))
    readMoreBtn.innerText = 'Read More'
    readMoreBtn.classList.add('movie-card-btn')
    infBox.appendChild(moviTitle)
    const movieGanre = document.createElement('div')
    movieCard.classList.add("movie-Ganre")
    const genreArr = selectGenre(movie , genres)
    movieGanre.innerHTML = `<p>Ganre: ${createGanres(genreArr)}</p>`
    infBox.appendChild(movieGanre)
    infBox.appendChild(addMovieBtn)
    infBox.appendChild(readMoreBtn)
    return movieCard
}

function createMovieReadMoreCard(movie){

}

function renameBtnAddMovie(movie , btn){
    isWatchListContainsMovie(movie) ? btn.innerText = 'Remove from Watch List': btn.innerText = 'Add to Watch List'
}


function createWatchMovie(movie){
    const li = document.createElement('li')
    li.classList.add('watch-list-item')
    const movieTitle = document.createElement('h3')
    movieTitle.innerText = `${movie.title}`
    const removeBtn = document.createElement('button')
    removeBtn.classList.add('movie-card-btn')
    removeBtn.innerText = 'Remove movie'
    removeBtn.addEventListener('click' ,()=> removeMovieFromWatchList(movie))
    removeBtn.addEventListener('click', randerWatchList)
    li.appendChild(movieTitle)
    li.appendChild(removeBtn)
    return li
}


function randerWatchList(){
    moviesContainer.innerText = ""
    const list = document.createElement('ul')
    list.classList.add('watch-list')
    const watchlist = watchListArray.map(movie => createWatchMovie(movie))
    watchlist.forEach(movie => list.appendChild(movie))
    moviesContainer.classList.add('show-about-movie')
    moviesContainer.appendChild(list)
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
    moviesContainer.classList.remove('show-about-movie')
    const moviesArr = ensureArray(movie)
    const moviesList = moviesArr.map(movie => createMoviCard(movie , genres))
    moviesList.forEach(movie => moviesContainer.appendChild(movie))
}

init()

