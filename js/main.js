// menu
const leftMenu = document.querySelector(".left-menu");
const hamburger = document.querySelector(".hamburger");

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

document.body.addEventListener("click", (event) => {
  const target = event.target;
  const dropdown = target.closest(".dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
    leftMenu.classList.add("openMenu");
    hamburger.classList.add("open");
  }
});

function changeAttrs(elem) {
  let tmp = elem.src;
  elem.setAttribute("src", elem.dataset.backdrop);
  elem.setAttribute("data-backdrop", tmp);
}

Array.from(document.querySelectorAll(".tv-card__img")).map((item) => {
  item.addEventListener("mouseover", (event) => {
    changeAttrs(event.target);
  });
  item.addEventListener("mouseout", (event) => {
    changeAttrs(event.target);
  });
});
