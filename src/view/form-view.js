import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDateTime } from '../utils/date-time.js';
import { POINTS_TYPE } from '../const.js';

const createTypeTemplate = (type, currentType, id) => {
  const isChecked = type === currentType ? 'checked' : '';

  return `
    <div class="event__type-item">
      <input id="event-type-${type}-${id}"
        class="event__type-input visually-hidden"
        type="radio" name="event-type" value="${type}" ${isChecked}>
      <label class="event__type-label event__type-label--${type}"
        for="event-type-${type}-${id}">
        ${type[0].toUpperCase() + type.slice(1)}
      </label>
    </div>
  `;
};

const createOfferTemplate = (offer, selected = []) => {
  const isChecked = selected.includes(offer.id) ? 'checked' : '';

  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden"
        id="event-offer-${offer.id}"
        type="checkbox"
        name="event-offer-${offer.id}" ${isChecked}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        +€&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `;
};

const createOfferListTemplate = (offers = [], selectedOffers = []) => {
  if (!offers.length) {
    return '';
  }

  return `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offers.map((offer) => createOfferTemplate(offer, selectedOffers)).join('')}
      </div>
    </section>
  `;
};

const createPictureTemplate = ({ src, description }) =>
  `<img class="event__photo" src="${src}" alt="${description}">`;

const createPhotosTemplate = (pictures = []) => {
  if (!pictures.length) {
    return '';
  }
  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map(createPictureTemplate).join('')}
      </div>
    </div>
  `;
};

const createDestinationTemplate = (destination) => {
  if (!destination) {
    return '';
  }
  const { description = '', pictures = [] } = destination;

  if (!description && !pictures.length) {
    return '';
  }

  return `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${createPhotosTemplate(pictures)}
    </section>
  `;
};


function createFormTemplate(point, offers, selectedOffers, destination, isNew) {
  const { id , type, dateFrom, dateTo, basePrice } = point;
  const destName = destination?.name ?? '';

  return `
    <li class="trip-events__item">
      <form class="event event--edit ${isNew ? 'event--new' : ''}" action="#" method="post">
        <header class="event__header">

          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17"
                src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-${id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${POINTS_TYPE.map((t) => createTypeTemplate(t, type, id)).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-${id}">
              ${type}
            </label>
            <input class="event__input event__input--destination"
              id="event-destination-${id}"
              type="text" name="event-destination"
              value="${destName}">
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input event__input--time"
              id="event-start-time-${id}"
              type="text" name="event-start-time"
              value="${humanizeDateTime(dateFrom)}">
            —
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input event__input--time"
              id="event-end-time-${id}"
              type="text" name="event-end-time"
              value="${humanizeDateTime(dateTo)}">
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input event__input--price"
              id="event-price-${id}"
              type="text" name="event-price"
              value="${basePrice}">
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${isNew ? 'Cancel' : 'Delete'}</button>

          ${isNew ? '' : `
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          `}
        </header>

        <section class="event__details">
          ${createOfferListTemplate(offers, selectedOffers)}
          ${createDestinationTemplate(destination)}
        </section>
      </form>
    </li>
  `;
}

export default class FormView extends AbstractView {
  #onSubmit = null;
  #onRollupClick = null;

  constructor({ point, offers, selectedOffers, destination, onSubmit, onRollupClick }) {
    super();
    this.point = point;
    this.offers = offers;
    this.selectedOffers = selectedOffers;
    this.destination = destination;
    this.#onSubmit = onSubmit;
    this.#onRollupClick = onRollupClick;
    this.#setHandlers();
  }

  get isNew() {
    return this.point.id === null;
  }

  get template() {
    return createFormTemplate(
      this.point,
      this.offers,
      this.selectedOffers,
      this.destination,
      this.isNew
    );
  }

  get formElement() {
    return this.element.querySelector('form');
  }

  get rollupButton() {
    return this.element.querySelector('.event__rollup-btn');
  }

  #setHandlers() {
    this.formElement.addEventListener('submit', this.#formSubmitHandler);
    if (!this.isNew) {
      this.rollupButton.addEventListener('click', this.#rollupClickHandler);
    }
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmit(this.point);
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick();
  };
}
