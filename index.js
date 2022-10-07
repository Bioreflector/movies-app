const myApiKey = "?api_key=0173d6afde5e852201a2850602f70181"
const urlForGanres = "https://api.themoviedb.org/3/genre/movie/list"
const imgurl = "https://image.tmdb.org/t/p/w500/"
const moviesContainer = document.querySelector('.movies-colection-wrapper')
const watchListBtn = document.querySelector('.watch-list-btn')
const homeBtn = document.querySelector('.back-btn')
let watchListArray = JSON.parse(localStorage.getItem('watchList'))
if(watchListArray === null){
    watchListArray = []
}
const title = document.querySelector('.title')
let moviesArray = []
let titleText = ''


watchListBtn.addEventListener('click' , clickWatchListBtn)
homeBtn.addEventListener('click', clickHomeBtn)

function saveToMemory() {
    localStorage.setItem('watchList', JSON.stringify(watchListArray))
}
const searchForm = document.searchMovieForm
const {searchInput , searchBtn} = searchForm

searchBtn.addEventListener('click' , showSerchedMovies)

async function getSerchedMovies(value){
    const response = await fetch(`https://api.themoviedb.org/3/search/movie${myApiKey}&language=en-US&query=${value}`)
    const movies = await response.json()
    const {results} = movies
    moviesArray = results
    return results
   
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

function clickWatchListBtn(){
    title.innerText = "Watch List"
    randerWatchList()
}
function clickHomeBtn(){
    title.innerText = titleText
    init()
}

async function showSerchedMovies(event){
    event.preventDefault()
    titleText = 'Serched Movies'
    title.innerText = titleText
    const value = searchInput.value
    const movies = await getSerchedMovies(value)
    const genres = await getGenres()
    rander(movies , genres)
}



function addMovieToWathList(movie){
    watchListArray.push(movie)
    saveToMemory()
}
function removeMovieFromWatchList(movie){
    watchListArray = watchListArray.filter(item => item.id !== movie.id)
    saveToMemory()
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


async function init(){
    const movies = await getMovies()
    const genres = await getGenres()
    titleText = 'Populyar Movies'
    title.innerText = titleText
    moviesArray = movies
    rander(movies , genres)
}



function createImgForMovieCard(movie){
    const imgBox = document.createElement('div')
    imgBox.classList.add('movie-card-img-box')
    imgBox.innerHTML = `<img src ="${imgurl}${movie.poster_path}" alt ="movieImg">`
    return imgBox
}
function createTitleAndGenreForMovieCard(movie , genres){
    const container = document.createElement('div')
    const moviTitle = document.createElement('h3')
    const movieGenre = document.createElement('div')
    moviTitle.innerText = `${movie.title}`
    const genreArr = selectGenre(movie , genres)
    movieGenre.innerHTML = `<p>Ganre: ${createGanres(genreArr)}</p>`
    container.appendChild(moviTitle)
    container.appendChild(movieGenre)
    return container
}
function createBtnActionForMoviCard(movie){
    const addMovieBtn = document.createElement('button')
    addMovieBtn.innerText = isWatchListContainsMovie(movie) ? 'Remove from Watch List' : 'Add to Watch List'
    addMovieBtn.addEventListener('click', ()=> addOrRemoveMovie(movie))
    addMovieBtn.addEventListener('click', () => renameBtnAddMovie(movie , addMovieBtn))
    addMovieBtn.classList.add('movie-card-btn')
    return addMovieBtn
}

function createMoviCard(movie , genres){
    const movieCard = document.createElement('div')
    movieCard.classList.add('movie-card')
    movieCard.appendChild(createImgForMovieCard(movie)) 
    const infBox = document.createElement('div')
    infBox.classList.add('movie-card-inf-box')
    infBox.appendChild(createTitleAndGenreForMovieCard(movie , genres))
    movieCard.appendChild(infBox)
    const readMoreBtn = document.createElement('button')
    readMoreBtn.addEventListener('click', () => randerReadeMore(movie , genres))
    readMoreBtn.innerText = 'Read More'
    readMoreBtn.classList.add('movie-card-btn')
    infBox.appendChild(createBtnActionForMoviCard(movie))
    infBox.appendChild(readMoreBtn)
    return movieCard
}

function createReadMoreCard(movie ,genres){
    const movieCard = document.createElement('div')
    movieCard.classList.add('movie-card')
    movieCard.appendChild(createImgForMovieCard(movie))
    const infBox = document.createElement('div')
    infBox.classList.add('movie-card-inf-box')
    infBox.appendChild(createTitleAndGenreForMovieCard(movie , genres))
    const overview = document.createElement('p')
    overview.innerText = `${movie.overview}`
    infBox.appendChild(overview)
    infBox.appendChild(createBtnActionForMoviCard(movie))
    const backBtn = document.createElement('button')
    backBtn.classList.add('movie-card-btn')
    backBtn.innerText = "Go Back"
    backBtn.addEventListener('click' , ()=> goBack(genres))
    infBox.appendChild(backBtn)
    movieCard.appendChild(infBox)
    return movieCard 
}
function goBack(genres){
    title.innerText = titleText
    rander(moviesArray , genres)
}

function randerReadeMore(movie , genres){
    title.innerText = "About Movie"
    moviesContainer.innerText = ""
    moviesContainer.classList.add('show-about-movie')
    moviesContainer.appendChild(createReadMoreCard(movie , genres))
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

