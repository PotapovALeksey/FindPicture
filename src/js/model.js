import v4 from "uuid/v4";
import * as storage from "./services/storage";
import axios from "axios";

export default class Model {
  constructor() {
    this.images;
  }

  getImages({ value, page }) {
    const url = `https://pixabay.com/api/?key=10567450-40b1156fc7fcc73c8204438b4&image_type=photo&q=${value}&per_page=8&page=${page}`;

    return axios(url).then(
      response => {
        console.log(response.data.hits);
        return (this.images = [...response.data.hits.map(item => item.webformatURL)])

      }
    );
  }

  getMoreImages({ value, page }) {
    const url = `https://pixabay.com/api/?key=10567450-40b1156fc7fcc73c8204438b4&image_type=photo&q=${value}&per_page=8&page=${page}`;

    return axios(url).then(
      response =>
        (this.images = [
          ...this.images,
          ...response.data.hits.map(item => item.webformatURL)
        ])
    );
  }
}
