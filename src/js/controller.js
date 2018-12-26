export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.on("create", this.createCard.bind(this));
    view.on("loadMore", this.updateCard.bind(this));
    view.on('openModal', this.openModal.bind(this));
    view.on('closeModal', this.closeModal.bind(this));
  }

  createCard(value) {
    this.model.getImages(value).then(data => this.view.createMarkup(data));
  }

  updateCard(value) {
    this.model.getMoreImages(value).then(data => this.view.createMarkup(data));
  }

  openModal(target) {
    this.view.showModal(target)
  }

  closeModal(event) {
    this.view.closeModal(event);
  }
}
