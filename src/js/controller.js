export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.on("create", this.createCards.bind(this));
    view.on("loadMore", this.updateCard.bind(this));
    view.on("openModal", this.openModal.bind(this));
    view.on("closeModal", this.closeModal.bind(this));
    view.on("addFavorites", this.addToFavorites.bind(this));
    view.on("createFavoritesCards", this.createFavoritesCards.bind(this));
    view.on("deleteFavorites", this.deleteFavoritesCard.bind(this));
  }

  createCards(value) {
    this.model.getImages(value).then(data => this.view.createMarkup(data));
  }

  updateCard(value) {
    this.model.getMoreImages(value).then(data => this.view.createMarkup(data));
  }

  openModal(value) {
    this.view.showModal(value);
  }

  closeModal(event) {
    this.view.closeModal(event);
  }

  addToFavorites(image) {
    this.model.addToFavorites(image);
  }

  createFavoritesCards(data) {
    this.model
      .getFavoritesCards()
      .then(data => this.view.createFavoritesMarkup(data));
  }

  deleteFavoritesCard(item) {
    console.log(item);
    this.model.deleteFavoritesCard(item);
    this.view.deleteItem(item);
  }
}
