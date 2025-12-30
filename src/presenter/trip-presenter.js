import { render, RenderPosition } from '../render.js';
import SortView from '../view/sort-view';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import FormView from '../view/form-view.js';
import { BLANK_POINT } from '../const.js';

export default class TripPresenter {
  constructor({ tripEventsContainer, pointsModel }) {
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;

    this.tripPoints = [];
    this.eventList = null;
  }

  init() {
    this.tripPoints = [...this.pointsModel.getPoints()];

    render(new SortView(), this.tripEventsContainer, RenderPosition.AFTERBEGIN);

    this.eventList = new PointListView();
    render(this.eventList, this.tripEventsContainer);

    this.renderNewPointForm();
    this.renderEditForm(this.tripPoints[0]);
    this.tripPoints.forEach((point) => this.renderPoint(point));
  }

  renderNewPointForm() {

    const offers = this.pointsModel.getOffersByType(BLANK_POINT.type);
    const destination = null;

    const form = new FormView({
      point: BLANK_POINT,
      offers,
      selectedOffers: [],
      destination,
      isNew: true,
    });

    render(form, this.eventList.getElement(), RenderPosition.AFTERBEGIN);
  }

  renderEditForm(point) {
    const offers = this.pointsModel.getOffersByType(point.type);
    const destination = this.pointsModel.getDestinationById(point.destination);

    const form = new FormView({
      point,
      offers,
      selectedOffers: point.offers,
      destination,
      isNew: false,
    });

    render(form, this.eventList.getElement(), RenderPosition.BEFOREEND);
  }

  renderPoint(point) {
    const destination = this.pointsModel.getDestinationById(point.destination);
    const offers = this.pointsModel
      .getOffersByType(point.type)
      .filter((offer) => point.offers.includes(offer.id));

    const pointView = new PointView({ point, offers, destination });

    render(pointView, this.eventList.getElement(), RenderPosition.BEFOREEND);
  }
}
