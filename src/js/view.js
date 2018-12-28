import EventEmitter from "./services/event-emiter";
import createCard from "./templates/cards.hbs";
import createFavoritesCard from "./templates/favorites-cards.hbs";

export default class View extends EventEmitter {
  constructor() {
    super();
    this.form = document.querySelector(".js-actions__form");
    this.input = this.form.querySelector(".js-actions__input");
    this.main = document.querySelector(".js-main");
    this.buttonLoadMore = document.querySelector(".js-button-load-more");
    this.modal = document.querySelector(".js-modal");
    this.modalImage = document.querySelector(".js-modal-content__img");
    this.buttonModalClose = document.querySelector('[data-actions="close"]');
    this.buttonAddToFavorites = document.querySelector(
      '[data-actions="favorites"]'
    );
    this.buttonFavoritesMarkup = document.querySelector(
      ".js-header__btn-favorites"
    );
    this.buttonFavoritesDelete = document.querySelector(
      ".js-favorites-cards-list__button"
    );
    this.body = document.querySelector("body");
    this.currentValue = "";
    this.currentPage = 1;
    this.headerActions = document.querySelector(".js-header__actions");
    this.form.addEventListener("submit", this.formSubmit.bind(this));
    this.buttonLoadMore.addEventListener(
      "click",
      this.loadMoreImages.bind(this)
    );

    this.modal.addEventListener("click", this.handleCloseModal.bind(this));
    window.addEventListener("keydown", this.handleEscapeCloseModal.bind(this));
    this.buttonAddToFavorites.addEventListener(
      "click",
      this.handleClickAddFavorites.bind(this)
    );
    this.buttonFavoritesMarkup.addEventListener(
      "click",
      this.handleClickCreateFavoritesCards.bind(this)
    );
  }

  formSubmit(e) {
    e.preventDefault();
    this.currentValue = this.input.value;

    if (this.currentValue === "") return;

    this.form.reset();

    this.emit("create", { value: this.currentValue, page: this.currentPage });
  }

  loadMoreImages() {
    this.incrementCurrentPage();

    this.emit("loadMore", { value: this.currentValue, page: this.currentPage });
  }

  createMarkup(data) {
    this.main.addEventListener("click", this.handleClickCard.bind(this));

    const markup = createCard(data);
    this.main.innerHTML = markup;

    if (data.length !== 0) {
      this.showLoadMoreButton();
    } else {
      this.hideLoadMoreButton();
    }
  }

  createFavoritesMarkup(data) {
    if (data.length === 0) {
      this.main.innerHTML = this.addNoneFavorites();
      return;
    }
    const markup = createFavoritesCard(data);
    this.hideLoadMoreButton();
    this.addTitleFavorites();
    this.main.innerHTML = this.addTitleFavorites() + markup;
    const favoritesList = document.querySelector(".js-favorites-cards-list");
    favoritesList.addEventListener(
      "click",
      this.handleClickDeleteFavorites.bind(this)
    );
  }

  addTitleFavorites() {
    return '<p class="favorite-title">Избранное</p>';
  }

  addNoneFavorites() {
    return '<p class="favorite-title">У Вас нету избранных изображений!</p>';
  }

  handleClickCard({ target }) {
    const isImage = target.classList.contains("js-cards-list__img");

    if (!isImage) {
      return;
    }

    this.emit("openModal", { src: target.src, id: target.dataset.id });
  }

  handleClickAddFavorites(event) {
    const image = {
      id: this.modalImage.dataset.id,
      src: this.modalImage.src
    };

    this.emit("addFavorites", image);
  }

  handleClickCreateFavoritesCards() {
    this.emit("createFavoritesCards");
  }

  handleCloseModal(event) {
    this.emit("closeModal", event);
  }

  handleEscapeCloseModal(event) {
    if (event.code !== "Escape") {
      return;
    }

    this.emit("closeModal", event);
  }

  handleClickDeleteFavorites(event) {
    const isDelete = event.target.classList.contains("js-icon-delete");

    if (!isDelete) {
      return;
    }
    const item = event.target.closest(".js-favorites-cards-list__item");

    this.emit("deleteFavorites", item);
  }

  deleteItem(item) {
    item.remove();
  }

  showModal(src) {
    this.modalInsertPictureId(src);
    this.stopScroll();
    this.modal.classList.add("modal--hidden");
  }

  closeModal(event) {
    if (
      event.target.classList.contains("js-modal") &&
      this.modal.classList.contains("modal--hidden")
    ) {
      this.modal.classList.remove("modal--hidden");
      this.startScroll();
    }

    if (
      event.target.classList.contains("js-icon-cancel") &&
      this.modal.classList.contains("modal--hidden")
    ) {
      this.modal.classList.remove("modal--hidden");
      this.startScroll();
    }

    if (
      event.code === "Escape" &&
      this.modal.classList.contains("modal--hidden")
    ) {
      this.modal.classList.remove("modal--hidden");
      this.startScroll();
    }
  }

  modalInsertPictureId(src) {
    this.modalImage.src = src.src;
    this.modalImage.dataset.id = src.id;
  }

  showLoadMoreButton() {
    if (!this.buttonLoadMore.classList.contains("visible")) {
      this.buttonLoadMore.classList.add("visible");
    }
  }

  hideLoadMoreButton() {
    if (this.buttonLoadMore.classList.contains("visible")) {
      this.buttonLoadMore.classList.remove("visible");
    }
  }

  incrementCurrentPage() {
    this.currentPage += 1;
  }

  stopScroll() {
    this.body.classList.add("scroll-hidden");
  }

  startScroll() {
    this.body.classList.remove("scroll-hidden");
  }
}
