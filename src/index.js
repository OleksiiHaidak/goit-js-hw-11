import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { getImages } from "./axios_request";


const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("input[name='searchQuery']");
const gallery = document.querySelector(".gallery");
const target = document.querySelector(".js-guard");


let lightbox = new SimpleLightbox(".gallery a", { captionsData: "alt", captionDelay: 250 });
const perPage = 40;
let page = 1;
let totalHits = 0;


searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  page = 1;
  getImages(query, page, perPage).then(createMarkup);
  gallery.innerHTML = "";
  observer.unobserve(target);
});


async function createMarkup(response) {

  if (response.totalHits === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  };

  if (page === 1) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
  };

    if (response.hits.length === 0) {
    observer.unobserve(target);
    return;
  };

  const imagesMarkup = response.hits.map((image) => `
    <div class="photo-card">
      <a href="${image.largeImageURL}">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/>
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${image.downloads}
        </p>
      </div>
    </div>
  `).join("");


  gallery.insertAdjacentHTML("beforeend", imagesMarkup);
  lightbox.refresh();
  observer.observe(target);
};


let options = {
  root: null,
  rootMargin: "300px",
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      page++;
      getImages(searchInput.value.trim(), page, perPage).then(createMarkup);

      const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });

      if (page > Math.ceil(totalHits / perPage)) {
        observer.unobserve(target);
      };
    };
  });
};