// 과제 제출용 api
// `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`

// 무료버전, 로컬에서만 api 가능
// `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`

// API 와 기본변수
const API_KEY = ""; 
let articles = [];
let page = 1;
let totalPage = 1;
const PAGE_SIZE = 10;

let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${PAGE_SIZE}`
);

// 이벤트 리스너 - 카테고리 버튼(PC)
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) => 
  menu.addEventListener("click", (e) => getNewsByTopic(e))
);

// 이벤트 리스너 - 카테고리 버튼(MW)
const sideMenuItems = document.querySelectorAll("#sideMenu ul li");
sideMenuItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    getNewsByTopic(e);
    sideMenu.classList.remove("open"); // 메뉴 선택 후 사이드 메뉴 닫기
  });
});

// 이벤트 리스너 - 검색창
document.getElementById("search-input").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getNewsByKeyword();
    event.preventDefault();
  }
});

document.getElementById("search-input").addEventListener("focus", function () {
  this.value = "";  // 검색창 클릭시 기존 검색어 삭제
});

// 뉴스 API 호출 
const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", PAGE_SIZE);

    let response = await fetch(url);
    let data = await response.json();

    if (response.status == 200) {
      if (data.totalResults == 0) {
        page = 0;
        totalPage = 0;
        renderPagination();
        throw new Error("검색어와 일치하는 결과가 없습니다");
      }

      articles = data.articles;
      totalPage = Math.ceil(data.totalResults / PAGE_SIZE);
      render();
      renderPagination();
    } else {
      page = 0;
      totalPage = 0;
      renderPagination();
      throw new Error(data.message);
    }
  } catch (e) {
    errorRender(e.message);
    page = 0;
    totalPage = 0;
    renderPagination();
  }
};

// 최신 뉴스 호출
const getLatestNews = async () => {
  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  );
  await getNews();
};

// 카테고리별 뉴스 호출
const getNewsByTopic = async (event) => {
  const topic = event.currentTarget.textContent.toLowerCase();
  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${PAGE_SIZE}&category=${topic}&apiKey=${API_KEY}`
  );
  await getNews();
};

// 검색창 열기/닫기
const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

// 검색어로 뉴스 호출
const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}&country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  );
  await getNews();
};

// 상대시간 표시
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

// 뉴스 렌더링
const render = () => {
  let resultHTML = articles
    .map((news) => {
      return `<div class="news row align-items-center">
        <div class="col-md-4">
            <img class="news-img"
              src="${news.urlToImage}"
              onerror="this.onerror=null; this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';" />
        </div>
        <div class="col-md-8">
            <a class="title" target="_blank" href="${news.url}">${news.title}</a>
            <p>${
              news.description == null || news.description == ""
                ? "내용없음"
                : news.description.length > 200
                ? news.description.substring(0, 200) + "..."
                : news.description
            }</p>
            <div>
              ${news.source.name || "no source"}  
              ${formatRelativeDate(news.publishedAt)}
            </div>
        </div>
    </div>`;
    })
    .join("");

  document.getElementById("new-board").innerHTML = resultHTML;
};

// 페이지네이션 렌더링
const renderPagination = () => {
  let paginationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if (last > totalPage) {
    last = totalPage;
  }
  let first = last - 4 <= 0 ? 1 : last - 4;
  console.log("fff", first);
  if (page > 1) {
    paginationHTML = `<li class="page-item" onclick="pageClick(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="pageClick(${page - 1})">
                        <a class="page-link" href='#js-bottom'>&lt;</a>
                      </li>`;
  }
  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${i == page ? "active" : ""}">
                        <a class="page-link" href='#js-bottom' onclick="pageClick(${i})">${i}</a>
                       </li>`;
  }

  if (page < totalPage) {
    paginationHTML += `<li class="page-item" onclick="pageClick(${page + 1})">
                        <a class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="pageClick(${totalPage})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

// 페이지 클릭시 뉴스 호출
const pageClick = (pageNum) => {
  page = pageNum;
  window.scrollTo({ top: 0, behavior: "smooth" });
  getNews();
};

// 에러 메시지 렌더링
const errorRender = (message) => {
  document.getElementById("new-board").innerHTML = `
  <h3 class="text-center alert alert-danger mt-1">${message}</h3>`;
};

// 최신 뉴스 호출
getLatestNews();

// 모바일 햄버거/검색 아이콘 토글
const hamburgerMenu = document.getElementById("hamburgerMenu");
const sideMenu = document.getElementById("sideMenu");
const searchIcon = document.getElementById("searchIcon");
const searchBarDiv = document.getElementById("searchBar");

hamburgerMenu.addEventListener("click", () => {
  sideMenu.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (sideMenu.classList.contains("open") &&
     !sideMenu.contains(e.target) && 
     !hamburgerMenu.contains(e.target)
    ) {
    sideMenu.classList.remove("open");
  }
});

searchIcon.addEventListener("click", () => {
  searchBarDiv.classList.toggle("active");
});
