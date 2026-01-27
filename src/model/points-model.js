import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;

    this.#pointsApiService.points.then((points) => {
      this.#points = points.map(this.#adaptToClient);
    });
  }

  get points() {
    return this.#points;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    this.#points = [...this.#points.slice(0, index), update, ...this.#points.slice(index + 1),];
    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [update, ...this.#points,];
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }
    this.#points = [...this.#points.slice(0, index), ...this.#points.slice(index + 1)];
    this._notify(updateType);
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      id: point.id,
      type: point.type,
      basePrice: point.base_price,
      dateFrom: new Date(point.date_from),
      dateTo: new Date(point.date_to),
      destination: point.destination,
      isFavorite: point.is_favorite,
      offers: point.offers.slice(),
    };
    return adaptedPoint;
  }
}
