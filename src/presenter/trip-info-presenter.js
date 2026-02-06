import { render, replace, remove, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import { UpdateType } from '../const.js';
import { sortByDateFrom, formatHeaderDate } from '../utils/date-time.js';

export default class TripInfoPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripInfoContainer = null;
  #tripInfoComponent = null;

  constructor({tripInfoContainer, pointsModel, offersModel, destinationsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
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
      if (this.#tripInfoComponent !== null) {
        remove(this.#tripInfoComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    const prev = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({
      routeTitle: this.#calcRouteTitle(points),
      datesText: this.#calcDates(points),
      totalPrice: this.#calcTotalPrice(points),
    });

    if (!prev) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prev);
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
