//Data

const api = axios.create({
    baseURL: 'http://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
    },
});

function likedMoviesList(){
    const item =  localStorage.getItem('liked_movies'); //llega en string

    let movies;

    if (item){
        movies = item;
        movies = JSON.parse(movies);
    } else {
        movies = {}
    }


    // console.log('objeto peliculas favoritas');
    // console.log(movies);
    return movies; // se envia como objeto
}

function likeMovie(movie){
    const likedMovies = likedMoviesList(); //llega en objeto, no en string
    if(likedMovies[movie.id]){
        console.log('se borra la peli de favoritos');
        likedMovies[movie.id] = undefined;// elimina de la lista de favoritos
    }else{
        console.log('se guarda la peli en favoritos')
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies',JSON.stringify(likedMovies));// se convierte en string y se envia
    getLikedMovies();
    getTrendingMoviesPreview();

}


//Utils

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry)=>{
        //console.log({entry});
        if(entry.isIntersecting){
            //console.log('IS intersecting');
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src',url);
        }
    })
});

function readAndPutMovies(pelis, div, {lazyLoad = false, clean = true}={}){ // create movies

    if(clean){
        div.innerHTML="";
    }
    pelis.forEach(peli => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', peli.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300' + peli.poster_path
            );
        movieImg.addEventListener('click',()=>{
            location.hash= `#movie=${peli.id}`
        });

        movieImg.addEventListener('error', () =>{
            movieImg.setAttribute('src', 'https://static.platzi.com/static/images/error/img404.png');
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        movieBtn.addEventListener('click',()=>{
            movieBtn.classList.toggle('movie-btn--liked'); // INTERCAMBIA LA CLASE EN CADA CLICK
            likeMovie(peli);
            //DEBERIAMOS AGREGAR LA PELICULA A LOCAL STORAGE
        });

        likedMoviesList()[peli.id] &&  movieBtn.classList.add('movie-btn--liked');
        // const listaDeFavoritos= likedMoviesList()
        // if(peli.id in listaDeFavoritos){
        //     // console.log('esta peli ya esta en favoritos');
        //     // console.log(peli.id);
        //     movieBtn.classList.add('movie-btn--liked');
        // }

        if(lazyLoad){
            lazyLoader.observe(movieImg); //observamos el contenedor de la imagen del DOM
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
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

    readAndPutMovies(movies, trendingMoviesPreviewList, true);
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
    maxPage = data.total_pages;
    readAndPutMovies(movies, genericSection ,{lazyLoad: true});
}

function getPaginatedMoviesByCategory(id){ // se activa al llegar al final del scroll
    return async function(){ //podemos acceder al query por closures.
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollIsBottom=(scrollTop + clientHeight) >= (scrollHeight -15);
        const pageIsNotMax = page < maxPage;

        if(scrollIsBottom && pageIsNotMax) {

            page++;
            const {data} = await api('discover/movie',{
                params:{
                    with_genres: id,
                    page,
                },
            });
            const movies = data.results;

            readAndPutMovies(movies, genericSection,{
                lazyLoad: true,
                clean: false,
            });
        }
    }
}

async function getMoviesBySearch(query){
    const {data} = await api('search/movie',{
        params:{
            query,
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);
    readAndPutMovies(movies,genericSection);

}

function getPaginatedMoviesBySearch(query){ // se activa al llegar al final del scroll
    return async function(){ //podemos acceder al query por closures.
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollIsBottom=(scrollTop + clientHeight) >= (scrollHeight -15);
        const pageIsNotMax = page < maxPage;

        if(scrollIsBottom && pageIsNotMax) {
            page++;
            const {data} = await api('search/movie',{
                params:{
                    query,
                    page,
                },
            });
            const movies = data.results;
            readAndPutMovies(movies, genericSection,{
                lazyLoad: true,
                clean: false,
            });
        }
    }
}

async function getTrendingMovies(){
    const {data} = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(data.total_pages);


    readAndPutMovies(movies, genericSection,{
        lazyLoad: true,
        clean: true,
    });

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerHTML = 'Cargar más';
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);
}

async function getPaginatedTrendingMovies(){ // se activa al llegar al final del scroll
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBottom=(scrollTop + clientHeight) >= (scrollHeight -15);
    const pageIsNotMax = page < maxPage;
    if(scrollIsBottom && pageIsNotMax){
        page++;
        const {data} = await api('trending/movie/day',{
            params: {
                page,
            }
        });
        const movies = data.results;

        readAndPutMovies(movies, genericSection,{
            lazyLoad: true,
            clean: false,
        });
    }
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

function getLikedMovies(){
    const likedMovies = likedMoviesList();
    //{keys:'values', keys: 'values'}
    //['value1', 'value2']

    const moviesArray = Object.values(likedMovies);
    console.log('Array de peliculas favoritas');
    console.log(moviesArray);

    readAndPutMovies(moviesArray, likedMoviesListArticle,
        {lazyLoad: false, clean: true});
}