import AbstractView from '../framework/view/abstract-view.js';

const createTripInfoTemplate = ({routeTitle, datesText, totalPrice}) => `
  <section class="trip-main__trip-info trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${routeTitle || '—'}</h1>
      <p class="trip-info__dates">${datesText || '—'}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice ?? 0}</span>
    </p>
  </section>
`;

export default class TripInfoView extends AbstractView {
  #data = null;

  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createTripInfoTemplate(this.#data);
  }
}
