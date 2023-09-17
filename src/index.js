import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("input[name='searchQuery']");
const searchBtn = document.querySelector("button[type='submit']");
const gallery = document.querySelector(".gallery");
const target = document.querySelector(".js-guard");

const pixabayApiKey = '39445880-54b6798b916331fa60d6cbc62';
const url = 'https://pixabay.com/api/';
const perPage = 40;
let page = 1;
let totalHits = 0;

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  page = 1;
  getImages(query);
  gallery.innerHTML = "";
  observer.unobserve(target);
});


async function getImages(query) {
  try {
    const response = await axios.get(`${url}?key=${pixabayApiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
    
    totalHits = response.data.totalHits;

    if (totalHits === 0 && !error) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
};
    
    if (page === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
};
    createMarkup(response);
    
  } catch (error) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  };
};



function createMarkup(response) {
const imagesMarkup = response.data.hits.map((image) => `
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
    `).join('');

  gallery.insertAdjacentHTML('beforeend', imagesMarkup);
  new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });
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
      getImages(searchInput.value.trim());
      SimpleLightbox.refresh();


  const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

  window.scrollBy({
       top: cardHeight * 2,
       behavior: "smooth",
});
      
      if (page * perPage >= totalHits) {
        observer.unobserve(target);
      };
    };
   });
};