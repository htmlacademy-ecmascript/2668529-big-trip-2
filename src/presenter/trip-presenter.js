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
  #eventList = null;
  #emptyListView = null;
  #openedPointView = null;
  #openedFormView = null;

  constructor({ tripEventsContainer, pointsModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.points];

    if (this.#tripPoints.length === 0) {
      this.#renderEmptyList();
    } else {
      render(new SortView(), this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
      this.#eventList = new PointListView();
      render(this.#eventList, this.#tripEventsContainer);
      this.#tripPoints.forEach((point) => this.#renderPoint(point));
    }

    document.addEventListener('keydown', this.#handleFormEscKeyDown);
  }

  #renderEmptyList() {
    this.#emptyListView = new EmptyListView();
    render(this.#emptyListView, this.#tripEventsContainer);
  }

  #renderPoint(point) {
    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offers = this.#pointsModel.getOffersByType(point.type).filter((offer) => point.offers.includes(offer.id));
    const formOffers = this.#pointsModel.getOffersByType(point.type);

    let pointView = null;
    let formView = null;

    pointView = new PointView({
      point,
      offers,
      destination,
      onEditClick: () => {
        this.#replacePointToForm(pointView, formView);
      }
    });

    formView = new FormView({
      point,
      offers: formOffers,
      selectedOffers: point.offers,
      destination,
      isNew: false,
      onSubmit: () => {
        this.#replaceFormToPoint(formView, pointView);
      },
      onRollupClick: () => {
        this.#replaceFormToPoint(formView, pointView);
      }
    });

    render(pointView, this.#eventList.element, RenderPosition.BEFOREEND);
  }

  #replacePointToForm(pointView, formView) {
    if (this.#openedFormView && this.#openedFormView !== formView && this.#openedPointView) {
      replace(this.#openedPointView, this.#openedFormView);
    }

    replace(formView, pointView);
    this.#openedFormView = formView;
    this.#openedPointView = pointView;
  }

  #replaceFormToPoint(formView, pointView) {
    if (this.#openedFormView === formView) {
      replace(pointView, formView);
      this.#openedFormView = null;
      this.#openedPointView = null;
    }
  }

  #handleFormEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      if (this.#openedFormView && this.#openedPointView) {
        this.#replaceFormToPoint(this.#openedFormView, this.#openedPointView);
      }
    }
  };
}
