const ajax = new XMLHttpRequest();
const container = document.getElementById('root');
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store = {
  currentPage: 1,
}

function getData(url){
  ajax.open('GET', url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function newsFeed(){
  const newsFeed = getData(NEWS_URL);
  const newsList = [];
  let template = `
    <div class="container mx-auto p-4">
      <h1>Hacker News</h1>
      <ul>
        {{__news_feed__}}  
      </ul>
      <div>
        <a herf="#/page/{{__prev_page__}}">Prev Page</a>
        <a herf="#/page/{{__next_page__}}">Next Page</a>
      </div>
    </div>  
  `;
  
  for(let i = (store.currentPage -1) * 10; i < store.currentPage * 10; i++){
    newsList.push(`
      <li>
        <a href="#${newsFeed[i].id}}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </li>
      `);
  }

  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage -1 : 1);
  template = template.replace('{{__next_page__}}', store.currentPage + 1);

  container.innerHTML = newsList.join('');
}

function newsDetail() {
  const id = location.hash.substr(7);

  const newsContent = getData(CONTENT_URL.replace('@id', id));

  container.innerHTML = `
    <h1>${newsContent.title}</h1>

    <div>
      <a href="#/page/${store.currentPage}">List</a>
    </div>
    `;
}
function router() {
  const routePath = location.hash;

  if(routePath === ''){
    newsFeed();
  }else if(routePath.indexOf('#/page/') >=0) {
    store.currentPage = Number(routePath.substr(7));
    newsDetail();
  } else {
    newsDetail();
  }
}
window.addEventListener('hashchange', router);

router();