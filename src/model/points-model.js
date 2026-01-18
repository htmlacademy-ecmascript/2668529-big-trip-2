import { mockPoints } from '../mock/points.js';
import { mockDestinations } from '../mock/destinations.js';
import { mockOffers } from '../mock/offers.js';

export default class PointsModel {

  #points = [];
  #destinations = [];
  #offers = [];

  constructor() {
    this.#points = mockPoints;
    this.#destinations = mockDestinations;
    this.#offers = mockOffers;
  }

  get points() {
    return this.#points;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  getOffersByType(type) {
    const offerGroup = this.#offers.find((offer) => offer.type === type);
    return offerGroup ? offerGroup.offers : [];
  }
}
