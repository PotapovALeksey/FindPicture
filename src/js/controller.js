export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.on("create", this.createCard.bind(this));
    view.on("loadMore", this.updateCard.bind(this));
  }

  createCard(value) {
    this.model.getImages(value).then(data => this.view.createMarkup(data));
  }

  updateCard(value) {
    this.model.getMoreImages(value).then(data => this.view.createMarkup(data));
  }
}
