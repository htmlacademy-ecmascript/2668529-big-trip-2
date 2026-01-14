import { render, RenderPosition, replace } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import FormView from '../view/form-view.js';
import EmptyListView from '../view/empty-list-view.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #tripPoints = [];
  #eventList = new PointListView();
  #emptyListView = new EmptyListView();
  #sortComponent = new SortView();

  constructor({ tripEventsContainer, pointsModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#renderApp();
  }

  #renderSort() {
    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderEmptyList() {
    render(this.#emptyListView, this.#tripEventsContainer);
  }

  #renderEventList() {
    render(this.#eventList, this.#tripEventsContainer);
  }

  #renderPoint(point) {
    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offers = this.#pointsModel.getOffersByType(point.type).filter((offer) => point.offers.includes(offer.id));
    const formOffers = this.#pointsModel.getOffersByType(point.type);

    const pointView = new PointView({
      point,
      offers,
      destination,
      onEditClick: () => replacePointToForm()
    });

    const formView = new FormView({
      point,
      offers: formOffers,
      selectedOffers: point.offers,
      destination,
      isNew: false,
      onSubmit: () => replaceFormToPoint(),
      onRollupClick: () => replaceFormToPoint()
    });

    render(pointView, this.#eventList.element, RenderPosition.BEFOREEND);

    const handleFormEscKeyDown = (evt) => {
      if (evt.key === 'Escape') {
        replaceFormToPoint();
      }
    };

    function replacePointToForm() {
      replace(formView, pointView);
      document.addEventListener('keydown', handleFormEscKeyDown);
    }

    function replaceFormToPoint() {
      replace(pointView, formView);
      document.removeEventListener('keydown', handleFormEscKeyDown);
    }
  }

  #renderApp() {
    if (this.#tripPoints.length === 0) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();
    this.#renderEventList();
    this.#tripPoints.forEach((point) => this.#renderPoint(point));
  }
}
