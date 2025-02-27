function formatRelativeDate(dateStr) {
  const published = new Date(dateStr);
  const now = new Date();
  const diffMs = now - published;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);
  if (diffYear > 0) return diffYear + " years ago"; // 예: "2 years ago"
  if (diffMonth > 0) return diffMonth + " months ago"; // 예: "9 months ago"
  if (diffDay > 0) return diffDay + " days ago"; // 예: "2 days ago"
  if (diffHour > 0) return diffHour + " hours ago";
  if (diffMin > 0) return diffMin + " minutes ago";
  return diffSec + " seconds ago";
}

const API_KEY = `07eb738ae18f4e42a9496b947b24b544`;
let newsList = [];

const getNewsByCategory= async (event)=>{
  const category = event.target.textContent;

  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`);

  // 과제 제출용 api
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`

  // 무료버전, 로컬에서만 api 가능
  //`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`

  const response = await fetch(url);
  const data = await response.json();
  console.log("category",data);
  newsList = data.articles;
  render();
};


const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) => {
  menu.addEventListener("click",getNewsByCategory);
});

const getLatestNews = async () => {
  const url = new URL(
    // 과제 제출용 api
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`

    // 무료버전, 로컬에서만 api 가능
    //`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
  console.log("dddd", newsList);
};



const render = () => {
  const newsHTML = newsList
    .map((news) => {
      const summary = news.description
        ? news.description.length > 200
          ? news.description.slice(0, 200) + "…"
          : news.description
        : "내용없음";

      const imageHTML = news.urlToImage
        ? `<img class="news-img-size" 
        src="${news.urlToImage}" 
        alt="news image" 
        onerror="
          this.onerror=null; 
          this.outerHTML=
           '<div class=\\'no-image\\'>\
              <p>Image Not Available</p>\
            </div>';
       "
     />`
        : `<div class="no-image">no image</div>`;

      const sourceName = news.source && news.source.name ? news.source.name : "no source";

      const publishedDate = news.publishedAt ? formatRelativeDate(news.publishedAt) : "";

      return `<div class="row news">
          <div class="col-lg-4">
            ${imageHTML}
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${summary}</p>
            <div>
              ${sourceName} * ${publishedDate}
            </div>
          </div>
      </div>`;
    })
    .join("");
  document.getElementById("new-board").innerHTML = newsHTML;
};

getLatestNews();

const hamburgerMenu = document.getElementById("hamburgerMenu");
const sideMenu = document.getElementById("sideMenu");
const searchIcon = document.getElementById("searchIcon");
const searchBarDiv = document.getElementById("searchBar");

hamburgerMenu.addEventListener("click", () => {
  sideMenu.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (sideMenu.classList.contains("open") && !sideMenu.contains(e.target) && !hamburgerMenu.contains(e.target)) {
    sideMenu.classList.remove("open");
  }
});

searchIcon.addEventListener("click", () => {
  searchBarDiv.classList.toggle("active");
});
