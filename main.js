// 과제 제출용 api
// `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`

// 무료버전, 로컬에서만 api 가능
// `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`

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
  if (diffYear > 0) return diffYear + " years ago";
  if (diffMonth > 0) return diffMonth + " months ago";
  if (diffDay > 0) return diffDay + " days ago";
  if (diffHour > 0) return diffHour + " hours ago";
  if (diffMin > 0) return diffMin + " minutes ago";
  return diffSec + " seconds ago";
}

const API_KEY = `07eb738ae18f4e42a9496b947b24b544`;
let newsList = [];

function showError(message) {
  const newBoard = document.getElementById("new-board");
  newBoard.innerHTML = `
    <div class="alert alert-danger" role="alert">
      ${message}
    </div>
  `;
}

function buildNewsHTML(list) {
  if (!list || list.length === 0) {
    return `
      <div class="alert alert-danger" role="alert">
        No matches for your search
      </div>
    `;
  }

  const newsHTML = list
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
                 this.outerHTML='<div class=\\'no-image\\'><p>Image Not Available</p></div>';
               "
           />`
        : `<div class="no-image">no image</div>`;

      const sourceName = news.source && news.source.name ? news.source.name : "no source";
      const publishedDate = news.publishedAt ? formatRelativeDate(news.publishedAt) : "";

      return `
        <div class="row news">
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

  return newsHTML;
}

async function fetchNews(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.message || "Unknown error occurred.";
      showError(errorMsg);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching news:", error);
    showError("Failed to load news.");
    return null;
  }
}

async function getLatestNews() {
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`);
  const data = await fetchNews(url);
  if (data) {
    newsList = data.articles;
    render();
  }
}

const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) => {
  menu.addEventListener("click", getNewsByCategory);
});

const sideMenuItems = document.querySelectorAll("#sideMenu ul li");
sideMenuItems.forEach((item) => {
  item.addEventListener("click", getNewsByCategory);
  item.addEventListener("click", () => {
    sideMenu.classList.remove("open");
  });
});

async function getNewsByCategory(event) {
  const category = event.target.textContent;
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );
  const data = await fetchNews(url);
  if (data) { 
    newsList = data.articles;
    render();
  }
}

function render() {
  // ADDED/CHANGED: buildNewsHTML 사용
  const newsHTML = buildNewsHTML(newsList);
  document.getElementById("new-board").innerHTML = newsHTML;
}

function renderFiltered(filteredList) {
  const newsHTML = buildNewsHTML(filteredList);
  document.getElementById("new-board").innerHTML = newsHTML;
}

function normalizeText(str) {
  return str.replace(/[^\uAC00-\uD7A3a-zA-Z0-9]+/g, '').toLowerCase();
}

const searchInput = document.querySelector("#searchBar input");
const searchButton = document.querySelector("#searchBar button");

searchButton.addEventListener("click", () => {
  performSearch();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});



function performSearch() {
  const rawTerm = searchInput.value.trim();
  if (rawTerm === "") {
    render();
    return;
  }


  const normalizedTerm = normalizeText(rawTerm);
  const filteredNews = newsList.filter((news) => {
    const normalizedTitle = news.title ? normalizeText(news.title) : "";
    const normalizedDescription = news.description ? normalizeText(news.description) : "";
    return (
      normalizedTitle.includes(normalizedTerm) ||
      normalizedDescription.includes(normalizedTerm)
    );
  });

  renderFiltered(filteredNews);
}


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
