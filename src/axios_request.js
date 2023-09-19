import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';




const pixabayApiKey = "39445880-54b6798b916331fa60d6cbc62";
const url = "https://pixabay.com/api/";

export async function getImages(query, page, perPage) {
  try {
    const response = await axios.get(`${url}?key=${pixabayApiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
    totalHits = response.data.totalHits;
    return response.data;
  } catch (error) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  };
};
