import EventEmitter from "./services/event-emiter";
import createCard from "./templates/cards.hbs";

export default class View extends EventEmitter {
  constructor() {
    super();
    this.form = document.querySelector(".js-actions__form");
    this.input = this.form.querySelector(".js-actions__input");
    this.list = document.querySelector(".js-cards-list");
    this.buttonLoadMore = document.querySelector(".js-button-load-more");
    this.currentValue = "";
    this.currentPage = 1;
    this.headerActions = document.querySelector(".js-header__actions");
    this.form.addEventListener("submit", this.formSubmit.bind(this));
    this.buttonLoadMore.addEventListener(
      "click",
      this.loadMoreImages.bind(this)
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
    const markup = data.reduce(
      (acc, image) => (acc += createCard({ image })),
      ""
    );

    this.list.innerHTML = markup;

    if (data.length !== 0) {
      this.showLoadMoreButton();
      this.removeMarginTop();
    } else {
      this.hideLoadMoreButton();
    }
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

  removeMarginTop() {
    this.headerActions.style.marginTop = "-19px";
  }
}
