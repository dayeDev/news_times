const API_KEY = `07eb738ae18f4e42a9496b947b24b544`;
let news = []
const getLatestNews = async () => {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  news = data.articles;
  console.log("dddd", news);
};

getLatestNews();