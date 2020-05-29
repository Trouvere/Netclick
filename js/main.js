const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";
// const SERVER = "https://api.themoviedb.org/3";
// const API_KEY = "261e56954b4c05720d28746b757ad8ca";

const leftMenu = document.querySelector(".left-menu");
hamburger = document.querySelector(".hamburger");
tvShowsList = document.querySelector(".tv-shows__list");
modal = document.querySelector(".modal");
tvShows = document.querySelector(".tv-shows");
tvCardImg = document.querySelector(".tv-card__img");
modalTitle = document.querySelector(".modal__title");
genresList = document.querySelector(".genres-list");
rating = document.querySelector(".rating");
description = document.querySelector(".description");
modalLink = document.querySelector(".modal__link");
searchForm = document.querySelector(".search__form");
searchFormInput = document.querySelector(".search__form-input");

const loading = document.createElement("div");
loading.className = "loading";

const DBService = class {
  constructor() {
    this.SERVER = "https://api.themoviedb.org/3";
    this.API_KEY = "261e56954b4c05720d28746b757ad8ca";
  }
  getData = async (url) => {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`failed load data`);
    }
  };

  getTestData = () => {
    return this.getData("test.json");
  };

  getTestCard = () => {
    return this.getData("card.json");
  };

  getSearchResult = (query) =>
    this.getData(
      `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`
    );

  getTvShow = (id) =>
    this.getData(
      `${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`
    );
};

const renderCard = (response) => {
  tvShowsList.textContent = "";
  console.log(response);

  response.results.forEach((item) => {
    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote,
      id,
    } = item;

    const posterIMG = poster ? IMG_URL + poster : "img/no-poster.jpg";
    const backdropIMG = backdrop ? IMG_URL + backdrop : "";
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : "";

    const card = document.createElement("li");
    card.idTV = id;
    card.className = "tv-shows__item";
    card.innerHTML = `<a href="#" id="${id}" class="tv-card">
          ${voteElem}
     
      <img class="tv-card__img"
           src="${posterIMG}"
           data-backdrop="${backdropIMG}"
          
           alt="${title}">
      <h4 class="tv-card__head">${title}</h4>
  </a>`;

    loading.remove();
    tvShowsList.append(card);
  });
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  if (value) {
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
  }
  searchFormInput.value = "";
});

tvShows.append(loading);
new DBService().getTestData().then((data) => {
  renderCard(data);
});

hamburger.addEventListener("click", () => {
  leftMenu.classList.toggle("openMenu");
  hamburger.classList.toggle("open");
});

document.body.addEventListener("click", (event) => {
  if (!event.target.closest(".left-menu")) {
    leftMenu.classList.remove("openMenu");
    hamburger.classList.remove("open");
  }
});

leftMenu.addEventListener("click", (event) => {
  const target = event.target;
  const dropdown = target.closest(".dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
    leftMenu.classList.add("openMenu");
    hamburger.classList.add("open");
  }
});

// open modal
tvShowsList.addEventListener("click", (event) => {
  const target = event.target;
  const card = target.closest(".tv-card");
  if (card) {
    new DBService()
      .getTvShow(card.id)
      .then(
        ({
          poster_path: posterPath,
          name: title,
          genres,
          vote_average: voteAverage,
          overview,
          homepage,
        }) => {
          tvCardImg.src = IMG_URL + posterPath;
          tvCardImg.alt = title;
          modalTitle.textContent = title;
          genresList.textContent = "";
          genres.forEach((item) => {
            genresList.innerHTML += `<li>${item.name}</li>`;
          });

          rating.textContent = voteAverage;
          description.textContent = overview;
          modalLink.href = homepage;
        }
      )
      .then(() => {
        document.body.style.overflow = "hidden";
        modal.classList.remove("hide");
      });
    document.body.style.overflow = "hidden";
    modal.classList.remove("hide");
  }
});
// cloze modal
modal.addEventListener("click", (event) => {
  const target = event.target;

  if (target.closest(".cross") || target.classList.contains("modal")) {
    document.body.style.overflow = "";
    modal.classList.add("hide");
  }
});

const changeImg = (event) => {
  // console.log("ev");
  const card = event.target.closest(".tv-shows__item");
  if (card) {
    const img = card.querySelector(".tv-card__img");
    if (img.dataset.backdrop) {
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
  }
};

tvShowsList.addEventListener("mouseover", changeImg);
tvShowsList.addEventListener("mouseout", changeImg);
