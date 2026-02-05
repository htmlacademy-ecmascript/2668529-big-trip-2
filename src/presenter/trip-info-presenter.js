import {render, replace, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import {UpdateType} from '../const.js';

const sortByDateFrom = (a, b) => a.dateFrom - b.dateFrom;

const formatHeaderDate = (date) =>
  date.toLocaleDateString('en-GB', {day: '2-digit', month: 'short'});

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #component = null;

  constructor({container, pointsModel, offersModel, destinationsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = [...this.#pointsModel.points].sort(sortByDateFrom);

    if (points.length === 0) {
      if (this.#component !== null) {
        remove(this.#component);
        this.#component = null;
      }
      return;
    }

    const prev = this.#component;

    this.#component = new TripInfoView({
      routeTitle: this.#calcRouteTitle(points),
      datesText: this.#calcDates(points),
      totalPrice: this.#calcTotalPrice(points),
    });

    if (!prev) {
      render(this.#component, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#component, prev);
    remove(prev);
  }

  #handleModelEvent = (updateType) => {
    if (
      updateType === UpdateType.INIT ||
      updateType === UpdateType.PATCH ||
      updateType === UpdateType.MINOR ||
      updateType === UpdateType.MAJOR
    ) {
      this.init();
    }
  };

  #calcRouteTitle(points) {
    const cities = points
      .map((p) => this.#destinationsModel.getDestinationById(p.destination)?.name)
      .filter(Boolean);

    if (cities.length === 0) {
      return '—';
    }
    if (cities.length <= 3) {
      return cities.join(' — ');
    }
    return `${cities[0]} — ... — ${cities.at(-1)}`;
  }

  #calcDates(points) {
    if (points.length === 0) {
      return '—';
    }
    const start = points[0].dateFrom;
    const end = points.at(-1).dateTo;
    return `${formatHeaderDate(start)} — ${formatHeaderDate(end)}`;
  }

  #calcTotalPrice(points) {
    return points.reduce((total, point) => {
      const base = point.basePrice ?? 0;

      const offersForType = this.#offersModel.getOffersByType(point.type) || [];
      const offersSum = (point.offers || []).reduce((sum, offerId) => {
        const offer = offersForType.find((o) => o.id === offerId);
        return sum + (offer?.price ?? 0);
      }, 0);

      return total + base + offersSum;
    }, 0);
  }
}
