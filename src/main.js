const api = axios.create({
    baseURL: 'http://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
    },
});

//Utils
function readAndPutMovies(pelis,div){
    div.innerHTML="";
    pelis.forEach(peli => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click',()=>{
            location.hash= `#movie=${peli.id}`
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', peli.title);
        movieImg.setAttribute(
            'src',
            'https://image.tmdb.org/t/p/w300' + peli.poster_path
        );
        
        movieContainer.appendChild(movieImg);
        div.appendChild(movieContainer);
    });
}

function createCategories(categories,container){
    container.innerHTML="";

    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id'+ category.id);
        categoryTitle.addEventListener('click', ()=>{
            location.hash=`#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name)
        
        categoryTitle.appendChild(categoryTitleText)
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}


//Llamados a la API
async function getTrendingMoviesPreview(){
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    readAndPutMovies(movies,trendingMoviesPreviewList);
}

async function getCategoriesPreview(){
    const {data} = await api('genre/movie/list'); //axios
    const categories = data.genres;

    createCategories(categories,categoriesPreviewList);
}

async function getMoviesByCategory(id){
    const {data} = await api('discover/movie',{
        params:{
            with_genres: id,
        },
    });
    const movies = data.results;

    readAndPutMovies(movies,genericSection);
}

async function getMoviesBySearch(query){
    const {data} = await api('search/movie',{
        params:{
            query,
        },
    });
    const movies = data.results;

    readAndPutMovies(movies,genericSection);
}

async function getTrendingMovies(){
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    readAndPutMovies(movies,genericSection);
}

async function getMoviesById(movieId){
    const {data: movie} = await api('movie/'+ movieId);
    //renombre data
    const movieImgUrl=`https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    headerSection.style.background = `linear-gradient(180deg,
    rgba(0, 0, 0, 0.35) 19.27%,
    rgba(0, 0, 0, 0) 29.17%),
    url(${movieImgUrl})`;
    movieDetailTitle.textContent=movie.title;
    movieDetailDescription.textContent= movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres,movieDetailCategoriesList);
    getRelatedMoviesById(movieId);
}

async function getRelatedMoviesById(id){
    const {data} = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;
    readAndPutMovies(relatedMovies,relatedMoviesContainer);
}
