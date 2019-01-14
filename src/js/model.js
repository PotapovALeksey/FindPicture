import v4 from "uuid/v4";
import * as storage from "./services/storage";
import axios from "axios";

export default class Model {
  constructor() {
    this.images;
    this.localStorageFavorites = storage.get() || [];
  }

  createArrayImages(arr) {
    return arr.reduce(
      (acc, item) => (acc = [...acc, { id: item.id, url: item.largeImageURL }]),
      []
    );
  }

  getImages({ value, page }) {
    const url = `https://pixabay.com/api/?key=10567450-40b1156fc7fcc73c8204438b4&image_type=photo&q=${value}&per_page=12&page=${page}`;

    return axios(url).then(response => {
      return (this.images = this.createArrayImages(response.data.hits));
    });
  }
  getMoreImages({ value, page }) {
    const url = `https://pixabay.com/api/?key=10567450-40b1156fc7fcc73c8204438b4&image_type=photo&q=${value}&per_page=12&page=${page}`;

    return axios(url).then(
      response =>
        (this.images = [
          ...this.images,
          ...this.createArrayImages(response.data.hits)
        ])
    );
  }

  addToFavorites(image) {
    const isValid = this.localStorageFavorites.some(
      value => value.id === image.id
    );
    if (!isValid) {
      this.localStorageFavorites = [image, ...this.localStorageFavorites];
      storage.set(this.localStorageFavorites);
    }
  }

  getFavoritesCards() {
    return Promise.resolve(this.localStorageFavorites);
  }

  deleteFavoritesCard(item) {
    const image = item.querySelector(".js-favorites-cards-list__img");
    const id = image.dataset.id;

    this.localStorageFavorites = this.localStorageFavorites.filter(
      item => item.id !== id
    );

    storage.set(this.localStorageFavorites);
  }
}
