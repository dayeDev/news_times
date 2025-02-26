const API_KEY = `07eb738ae18f4e42a9496b947b24b544`;
let newsList = [];
const getLatestNews = async () => {
  const url = new URL(
    // 과제 제출용 api
    // `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`

    // 무료버전, 로컬에서만 api 가능
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
  console.log("dddd", newsList);
};

const render = () => {
  const newsHTML = newsList.map(
    (news) => ` <div class = "row news">
          <div class = "col-lg-4">
            <img class="news-img-size" src = ${news.urlToImage} />
          </div>
          <div class = "col-lg-8">
            <h2>${news.title}</h2>
            <p>${news.description}</p>
          <div>
            ${news.source.name} * ${(news.publishedAt)}
         </div>
        </div>
      </div>`
  )
  .join('');



  document.getElementById("new-board").innerHTML = newsHTML;
};

getLatestNews();
