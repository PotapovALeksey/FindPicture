import EventEmitter from "./services/event-emiter";
import createCard from "./templates/cards.hbs";

export default class View extends EventEmitter {
  constructor() {
    super();
    this.form = document.querySelector(".js-actions__form");
    this.input = this.form.querySelector(".js-actions__input");
    this.list = document.querySelector(".js-cards-list");
    this.buttonLoadMore = document.querySelector(".js-button-load-more");
    this.modal = document.querySelector(".js-modal");
    this.modalImage = document.querySelector(".js-modal-content__img");
    this.buttonModalClose = document.querySelector('[data-actions="close"]');
    this.body = document.querySelector("body");
    this.currentValue = "";
    this.currentPage = 1;
    this.headerActions = document.querySelector(".js-header__actions");
    this.form.addEventListener("submit", this.formSubmit.bind(this));
    this.buttonLoadMore.addEventListener(
      "click",
      this.loadMoreImages.bind(this)
    );
    this.list.addEventListener("click", this.handleClickCard.bind(this));
    this.modal.addEventListener("click", this.handleCloseModal.bind(this));
    window.addEventListener("keydown", this.handleEscapeCloseModal.bind(this));
  }

  // createCard(image) {
  //   const card = document.createElement("li");
  //   card.classList.add("cards-list__item");

  //   const div = document.createElement("div");
  //   div.classList.add("cards-list__img");
  //   div.setAttribute(
  //     "style",
  //     "background-image: url(" +
  //       image +
  //       ");background-repeat: no-repeat;background-size: 100% 100%"
  //   );
  //   card.append(div);
  //   console.log(card);
  //   return card;
  // }

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
    const markup = data.reduce(
      (acc, image) => (acc += createCard({ image })),
      ""
    );

    this.list.innerHTML = markup;

    if (data.length !== 0) {
      this.showLoadMoreButton();
    } else {
      this.hideLoadMoreButton();
    }
  }
  // createMarkup(data) {
  //   const markup = data.map(image => this.createCard(image));
  //   console.log(markup);
  //   this.list.append(...markup);

  //   if (data.length !== 0) {
  //     this.showLoadMoreButton();
  //   } else {
  //     this.hideLoadMoreButton();
  //   }
  // }

  handleClickCard({ target }) {
    const nodeName = target.nodeName;
    if (nodeName !== "IMG") {
      return;
    }

    this.emit("openModal", target.src);
  }

  showModal(src) {
    this.modalInsertPicture(src);
    this.modal.classList.add("modal--hidden");
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

  closeModal(event) {
    if (
      event.target.classList.contains("js-modal") &&
      this.modal.classList.contains("modal--hidden")
    ) {
      this.modal.classList.remove("modal--hidden");
    }

    if (
      event.target.classList.contains("js-icon-cancel") &&
      this.modal.classList.contains("modal--hidden")
    ) {
      this.modal.classList.remove("modal--hidden");
    }

    if (
      event.code === "Escape" &&
      this.modal.classList.contains("modal--hidden")
    ) {
      this.modal.classList.remove("modal--hidden");
    }
  }

  modalInsertPicture(src) {
    this.modalImage.src = src;
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
}
