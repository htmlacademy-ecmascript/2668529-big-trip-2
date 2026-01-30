import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
      this._notify(UpdateType.LOADING_ERROR);
      return;
    }
    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, newPoint) {
    try {
      const response = await this.#pointsApiService.addPoint(newPoint);
      const createdPoint = this.#adaptToClient(response);

      this.#points = [createdPoint, ...this.#points];
      this._notify(updateType, createdPoint);

    } catch {
      throw new Error('Can’t add point');
    }
  }

  async deletePoint(updateType, point) {
    const index = this.#points.findIndex((p) => p.id === point.id);
    if (index === -1) {
      throw new Error('Can’t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(point);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType);

    } catch {
      throw new Error('Can’t delete point');
    }
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
      offers: point.offers,
    };

    return adaptedPoint;
  }
}
