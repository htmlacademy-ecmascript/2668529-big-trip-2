import { render, RenderPosition } from '../render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import FormView from '../view/form-view.js';

export default class TripPresenter {
  constructor({ filtersContainer, tripEventsContainer, pointsModel }) {
    this.filtersContainer = filtersContainer;
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;

    this.tripPoints = [];
    this.eventList = null;
  }

  init() {
    this.tripPoints = [...this.pointsModel.getPoints()];

    render(new FilterView(), this.filtersContainer, RenderPosition.BEFOREEND);
    render(new SortView(), this.tripEventsContainer, RenderPosition.AFTERBEGIN);

    this.eventList = new PointListView();
    render(this.eventList, this.tripEventsContainer);

    this.renderNewPointForm();
    this.renderEditForm(this.tripPoints[0]);
    this.tripPoints.forEach((point) => this.renderPoint(point));
  }

  renderNewPointForm() {
    const blankPoint = {
      id: null,
      type: 'taxi',
      dateFrom: null,
      dateTo: null,
      basePrice: '',
      offers: [],
      destination: null,
    };

    const offers = this.pointsModel.getOffersByType(blankPoint.type);
    const destination = null;

    const form = new FormView({
      point: blankPoint,
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
