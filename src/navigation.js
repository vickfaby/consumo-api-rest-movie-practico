let maxPage;1
let page = 1;
let infiniteScroll;

searchFormBtn.addEventListener('click',()=>{
    console.log('se presionó search');
    location.hash = '#search='+searchFormInput.value;
});

trendingBtn.addEventListener('click',()=>{
    console.log('se presionó search');
    location.hash = '#trends';
});

arrowBtn.addEventListener('click',()=>{
    console.log('se presionó search');
    history.back();
    location.hash = '#home';
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);


function navigator(){
    console.log({location});
    if(infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }
    if(location.hash.startsWith('#trends')){
        trendsPage()
    } else if(location.hash.startsWith('#search')){
        searchPage();
    } else if(location.hash.startsWith('#movie')){
        movieDetailPage();
    } else if(location.hash.startsWith('#category')){
        categoriesPage();
    } else {
        homePage();
    }
    if(infiniteScroll){
        window.addEventListener('scroll', infiniteScroll, {passive: false});
    }
}
function homePage(){

    console.log('Home!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background='';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}
function categoriesPage(){
    console.log('categories!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background='';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    //RECOLECCIÓN DEL DATO DEL ID PARA LA CATEGORÍA  
    const [_,categoryData] = location.hash.split('=');// ['#category','id-name']
    const [categoryId, categoryName] = categoryData.split('-');

    headerCategoryTitle.innerHTML= categoryName;
    getMoviesByCategory(categoryId);

    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}
function movieDetailPage(){
    console.log('Movie!!!');

    headerSection.classList.add('header-container--long');
    //headerSection.style.background='';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    
    const [_,movieId] = location.hash.split('=');// ['#movie,'465498']
    getMoviesById(movieId);
}
function searchPage(){
    console.log('Search!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background='';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_,query] = location.hash.split('=');// ['#search,'ironman']
    getMoviesBySearch(query);

    infiniteScroll = getPaginatedMoviesBySearch(query);
}
function trendsPage(){
    console.log('HTrends!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background='';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML ="Tendencias";
    getTrendingMovies();
    infiniteScroll = getPaginatedTrendingMovies;
}