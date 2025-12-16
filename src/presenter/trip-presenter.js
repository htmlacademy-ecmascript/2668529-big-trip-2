import { render, RenderPosition } from '../render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import NewFormView from '../view/new-form-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';

export default class TripPresenter {
  constructor({filtersContainer, tripEventsContainer, pointsModel}) {
    this.filtersContainer = filtersContainer;
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.tripPoints = [...this.pointsModel.getPoints()];

    render(new FilterView(), this.filtersContainer, RenderPosition.BEFOREEND);
    render(new SortView(), this.tripEventsContainer, RenderPosition.AFTERBEGIN);

    this.eventList = new PointListView();
    render(this.eventList, this.tripEventsContainer);

    render(new NewFormView({
      point: this.tripPoints[0],
      offers: this.pointsModel.getOffersByType(this.tripPoints[0].type),
      checkedOffers: this.tripPoints[0].offers,
      destination: this.pointsModel.getDestinationById(this.tripPoints[0].destination)
    }), this.eventList.getElement(), RenderPosition.AFTERBEGIN);

    for (let i = 0; i < this.tripPoints.length; i++) {
      const point = this.tripPoints[i];
      const destination = this.pointsModel.getDestinationById(point.destination);
      const offers = this.pointsModel.getOffersByType(point.type)
        .filter((offer) => point.offers.includes(offer.id));
      render(new PointView({point, offers, destination}), this.eventList.getElement());
    }
  }
}
