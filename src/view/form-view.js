import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
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
    </div>`;
};

const createOfferTemplate = (offer, selectedOffers = []) => {
  const isChecked = selectedOffers.includes(offer.id) ? 'checked' : '';
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
    </div>`;
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
    </section>`;
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
    </div>`;
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
    </section>`;
};

function createFormTemplate(state, allDestinations = []) {
  const { point, offers, selectedOffers, destination } = state;
  const { id, type, dateFrom, dateTo, basePrice } = point;
  const destName = destination?.name ?? '';

  const destinationOptions = allDestinations
    .map((dest) => `<option value="${dest.name}"></option>`)
    .join('');

  return `
    <li class="trip-events__item">
      <form class="event event--edit ${id === null ? 'event--new' : ''}" action="#" method="post">
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
              ${type[0].toUpperCase() + type.slice(1)}
            </label>
            <input class="event__input event__input--destination"
              id="event-destination-${id}"
              type="text"
              name="event-destination"
              value="${destName}"
              list="destination-list-${id}">
            <datalist id="destination-list-${id}">
              ${destinationOptions}
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input event__input--time"
              id="event-start-time-${id}"
              type="text"
              name="event-start-time"
              value="${humanizeDateTime(dateFrom)}">
            —
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input event__input--time"
              id="event-end-time-${id}"
              type="text"
              name="event-end-time"
              value="${humanizeDateTime(dateTo)}">
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>€
            </label>
            <input class="event__input event__input--price"
               id="event-price-${id}"
               type="number"
               name="event-price"
               value="${basePrice}"
               min="0"
               step="1"
               inputmode="numeric"
               style="-moz-appearance: textfield;">
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${id === null ? 'Cancel' : 'Delete'}</button>

          ${id !== null ? `<button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>` : ''}
        </header>

        <section class="event__details">
          ${createOfferListTemplate(offers, selectedOffers)}
          ${createDestinationTemplate(destination)}
        </section>
      </form>
    </li>`;
}

export default class FormView extends AbstractStatefulView {
  #onSubmit = null;
  #onRollupClick = null;
  #pointsModel = null;
  #allDestinations = [];

  constructor({ point, offers, selectedOffers, destination, onSubmit, onRollupClick, pointsModel, allDestinations }) {
    super();
    this.#pointsModel = pointsModel;
    this.#allDestinations = allDestinations;
    this.#onSubmit = onSubmit;
    this.#onRollupClick = onRollupClick;
    this._setState({point, offers, selectedOffers, destination});
    this._restoreHandlers();
  }

  get template() {
    return createFormTemplate(this._state, this.#allDestinations);
  }

  get formElement() {
    return this.element.querySelector('form');
  }

  get rollupButton() {
    return this.element.querySelector('.event__rollup-btn');
  }

  _restoreHandlers() {
    this.formElement.addEventListener('submit', this.#formSubmitHandler);
    this.rollupButton?.addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__type-group')?.addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination')?.addEventListener('input', this.#destinationInputHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);
    this.element.querySelector('.event__input--price')?.addEventListener('input', this.#priceChangeHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmit(this._state.point);
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick();
  };

  #typeChangeHandler = (evt) => {
    const newType = evt.target.value;
    const offers = this.#pointsModel.getOffersByType(newType);

    this.updateElement({
      point: { ...this._state.point, type: newType, offers: [] },
      offers,
      selectedOffers: []
    });
  };

  #destinationInputHandler = (evt) => {
    const name = evt.target.value.trim();
    const destination = this.#allDestinations.find((dest) => dest.name === name);

    if (!destination) {
      evt.target.value = '';
      return;
    }

    this.updateElement({
      point: { ...this._state.point, destination: destination.id },
      destination
    });
  };

  #offersChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__offer-checkbox')) {
      return;
    }

    const id = Number(evt.target.id.replace('event-offer-', ''));
    const selected = new Set(this._state.point.offers);

    if (evt.target.checked) {
      selected.add(id);
    } else {
      selected.delete(id);
    }

    this.updateElement({
      point: { ...this._state.point, offers: [...selected] },
      selectedOffers: [...selected]
    });
  };

  #priceChangeHandler = (evt) => {
    let value = evt.target.value.trim();
    if (value.startsWith('-')) {
      value = value.replace('-', '');
    }
    if (value === '') {
      evt.target.value = '';
      return;
    }
    const newPrice = Math.max(0, parseInt(value, 10) || 0);
    evt.target.value = newPrice;
    this._setState({
      point: {
        ...this._state.point,
        basePrice: newPrice
      }
    });
  };
}
