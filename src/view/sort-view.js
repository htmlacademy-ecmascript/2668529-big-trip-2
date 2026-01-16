import AbstractView from '../framework/view/abstract-view.js';

function createSortTemplate(currentSortType) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            <div class="trip-sort__item  trip-sort__item--day">
              <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day"
              ${currentSortType === 'day' ? 'checked' : ''}>
              <label class="trip-sort__btn" for="sort-day">Day</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--event">
              <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
              <label class="trip-sort__btn" for="sort-event">Event</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--time">
              <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time"
              ${currentSortType === 'time' ? 'checked' : ''}>
              <label class="trip-sort__btn" for="sort-time">Time</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--price">
              <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price"
              ${currentSortType === 'price' ? 'checked' : ''}>
              <label class="trip-sort__btn" for="sort-price">Price</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--offer">
              <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
              <label class="trip-sort__btn" for="sort-offer">Offers</label>
            </div>
          </form>`
  );
}

export default class SortView extends AbstractView {
  #onSortChange = null;
  #currentSortType = null;

  constructor({ currentSortType, onSortChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#onSortChange = onSortChange;
    this.element.addEventListener('click', this.#sortClickHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortClickHandler = (evt) => {
    const sortType = evt.target.dataset.sortType;
    if (!sortType) {
      return;
    }
    this.#onSortChange(sortType);
  };
}
