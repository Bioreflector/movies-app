const myApiKey = "?api_key=0173d6afde5e852201a2850602f70181"
const url = "https://api.themoviedb.org/3/movie/top_rated"
const imgurl = "https://image.tmdb.org/t/p/w500/"

async function getMoviesFromApi() {
    const response = await fetch(`${url}${myApiKey}`)
    const movies = await response.json()
    console.log(movies) 
}

getMoviesFromApi()