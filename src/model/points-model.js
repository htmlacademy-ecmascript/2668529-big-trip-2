import { mockPoints } from '../mock/points.js';
import { mockDestinations } from '../mock/destinations.js';
import { mockOffers } from '../mock/offers.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];

  constructor() {
    super();
    this.#points = mockPoints;
    this.#destinations = mockDestinations;
    this.#offers = mockOffers;
  }

  get points() {
    return this.#points;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addTask(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deleteTask(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  getOffersByType(type) {
    const offerGroup = this.#offers.find((offer) => offer.type === type);
    return offerGroup ? offerGroup.offers : [];
  }
}
