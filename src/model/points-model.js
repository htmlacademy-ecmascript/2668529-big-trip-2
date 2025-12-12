import { getRandomPoint } from '../mock/points.js';
import { mockDestinations } from '../mock/destinations.js';
import { mockOffers } from '../mock/offers.js';

const POINT_COUNT = 3;

export default class PointsModel {
  constructor() {
    this.points = Array.from({ length: POINT_COUNT }, getRandomPoint);
    this.destinations = mockDestinations;
    this.offers = mockOffers;
  }

  getPoints() {
    return this.points;
  }

  getDestinationById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }

  getOffersByType(type) {
    const offerGroup = this.offers.find((offer) => offer.type === type);
    return offerGroup ? offerGroup.offers : [];
  }

  getOfferById(type, offerIds = []) {
    const offers = this.getOffersByType(type);
    return offers.filter((offer) => offerIds.includes(offer.id));
  }
}
