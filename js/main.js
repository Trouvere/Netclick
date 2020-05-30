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
preloader = document.querySelector(".preloader");
dropdown = document.querySelectorAll(".dropdown");
tvShowsHead = document.querySelector(".tv-shows__head");
posterWrapper = document.querySelector(".poster__wrapper");
modalContent = document.querySelector(".modal__content");
pagination = document.querySelector(".pagination");

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

  getSearchResult = (query) => {
    this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
    return this.getData(this.temp);
  };

  getNextPage = (page) => {
    return this.getData(this.temp + "&page" + page);
  };
  getTvShow = (id) =>
    this.getData(
      `${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`
    );
  getTop = (item) => {
    this.temp = `${this.SERVER}/tv/${item}?api_key=${this.API_KEY}&language=ru-RU`;
    return this.getData(this.temp);
  };
};
const dbService = new DBService();

const renderCard = (response, target) => {
  tvShowsList.textContent = "";

  console.log(response);

  if (!response.total_results) {
    loading.remove();
    tvShowsHead.textContent = "К сожалению по запросу ничего не найдено";
    tvShowsHead.style.cssText = "color: red;";
    return;
  }
  tvShowsHead.textContent = target ? target.textContent : "Результат поиска";
  tvShowsHead.style.cssText = "color: green;";
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
  pagination.textContent = "";
  if (target && response.total_pages > 1) {
    for (let i = 1; i <= response.total_pages; i++) {
      pagination.innerHTML += `<li>            <a href="#" class="pages">${i}  </a> </li>`;
    }
  }
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  if (value) {
    new DBService().getSearchResult(value).then(renderCard);
  }
  searchFormInput.value = "";
});

tvShows.append(loading);
new DBService().getTestData().then((data) => {
  renderCard(data);
});

//  Side menu interaction
// разобраться с ошибкой
const closeDropDown = () => {
  dropdown.forEach((item) => {
    item.classList.remove("active");
  });
};

hamburger.addEventListener("click", () => {
  leftMenu.classList.toggle("openMenu");
  hamburger.classList.toggle("open");
  closeDropDown();
});

document.body.addEventListener("click", (event) => {
  if (!event.target.closest(".left-menu")) {
    leftMenu.classList.remove("openMenu");
    hamburger.classList.remove("open");
    closeDropDown();
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
  if (target.closest("#top-rated")) {
    tvShows.append(loading);
    tvShowsHead.textContent = "ТОП сериалы";
    dbService
      .getTop("top_rated")
      .then((response) => renderCard(response, target));
  }
  if (target.closest("#popular")) {
    tvShows.append(loading);
    tvShowsHead.textContent = "Популярные сериалы";
    dbService
      .getTop("popular")
      .then((response) => renderCard(response, target));
  }
  if (target.closest("#today")) {
    tvShows.append(loading);
    tvShowsHead.textContent = "Популярные сегодня";
    dbService
      .getTop("airing_today")
      .then((response) => renderCard(response, target));
  }
  if (target.closest("#week")) {
    tvShows.append(loading);
    tvShowsHead.textContent = "Популярные за неделю";
    dbService
      .getTop("on_the_air")
      .then((response) => renderCard(response, target));
  }
  if (target.closest("#search")) {
    tvShowsList.textContent = "";
    tvShowsHead.textContent = "";
  }
});

// open modal
tvShowsList.addEventListener("click", (event) => {
  const target = event.target;
  const card = target.closest(".tv-card");
  if (card) {
    preloader.style.display = "block";

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
          if (posterPath) {
            tvCardImg.src = IMG_URL + posterPath;
            tvCardImg.alt = title;
            posterWrapper.style.display = "";
            modalContent.style.paddingLeft = "";
          } else {
            posterWrapper.style.display = "none";
            modalContent.style.paddingLeft = "25px";
          }

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
      })
      .finally(() => {
        preloader.style.display = "none";
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
pagination.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target;
  if (target.classList.contains("pages")) {
    tvShows.append(loading);
    dbService.getNextPage(target.textContent).then(renderCard);
  }
});
