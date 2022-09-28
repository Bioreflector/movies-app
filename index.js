const myApiKey = "?api_key=0173d6afde5e852201a2850602f70181"
const urlForMovies = "https://api.themoviedb.org/3/movie/top_rated"
const urlForGanres = "https://api.themoviedb.org/3/genre/movie/list"
const imgurl = "https://image.tmdb.org/t/p/w500/"
const moviesContainer = document.querySelector('.movies-colection-wrapper')


async function getGenresFromApi(arr){
    const response = await fetch(`${urlForGanres}${myApiKey}`)
    const result = await response.json()
    const {genres} = result
    return genres

}

async function getMoviesFromApi() {
    const response = await fetch(`${urlForMovies}${myApiKey}`)
    const movies = await response.json()
    console.log (movies)
    const {results} = movies
    rander(results)
}



function createMoviCard(movie){
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
    moviTitle.addEventListener('click' , ()=> console.log('test'))
    infBox.appendChild(moviTitle)
    const movieGanre = document.createElement('div')
    movieCard.classList.add("movie-Ganre")
    movieGanre.innerHTML = `<h4>Ganre :</h4>`
    infBox.appendChild(movieGanre)
    return movieCard

}

function rander(arr){
    const moviesList = arr.map(movie => createMoviCard(movie))
    moviesList.forEach(movie => moviesContainer.appendChild(movie))
}



getMoviesFromApi()