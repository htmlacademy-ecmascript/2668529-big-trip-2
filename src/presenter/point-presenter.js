import { render, replace, remove, RenderPosition } from '../framework/render.js';
import PointView from '../view/point-view.js';
import FormView from '../view/form-view.js';

export default class PointPresenter {
  #eventList = null;
  #point = null;
  #pointsModel = null;

  #pointView = null;
  #formView = null;

  #onModeChange = null;
  #onDataChange = null;

  #mode = 'DEFAULT';

  constructor({ eventList, pointsModel, onModeChange, onDataChange }) {
    this.#eventList = eventList;
    this.#pointsModel = pointsModel;
    this.#onModeChange = onModeChange;
    this.#onDataChange = onDataChange;
  }

  init(point) {
    this.#point = point;

    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offers = this.#pointsModel.getOffersByType(point.type);
    const selectedOffers = point.offers;

    const prevPointView = this.#pointView;
    const prevFormView = this.#formView;

    this.#pointView = new PointView({
      point,
      offers: offers.filter((offer) => selectedOffers.includes(offer.id)),
      destination,
      onEditClick: () => this.#openForm(),
      onFavoriteClick: () => this.#toggleFavorite()
    });

    this.#formView = new FormView({
      point,
      offers,
      selectedOffers,
      destination,
      isNew: false,
      onSubmit: () => this.#closeForm(),
      onRollupClick: () => this.#closeForm()
    });

    if (!prevPointView && !prevFormView) {
      render(this.#pointView, this.#eventList.element, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === 'DEFAULT') {
      replace(this.#pointView, prevPointView);
    } else {
      replace(this.#formView, prevFormView);
    }

    remove(prevPointView);
    remove(prevFormView);
  }

  #toggleFavorite() {
    const updatedPoint = {
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    };

    this.#onDataChange(updatedPoint);
  }

  #openForm() {
    this.#onModeChange();
    replace(this.#formView, this.#pointView);
    this.#mode = 'EDITING';

    document.addEventListener('keydown', this.#escHandler);
  }

  #closeForm() {
    replace(this.#pointView, this.#formView);
    this.#mode = 'DEFAULT';

    document.removeEventListener('keydown', this.#escHandler);
  }

  resetView() {
    if (this.#mode !== 'DEFAULT') {
      this.#closeForm();
    }
  }

  #escHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeForm();
    }
  };

  destroy() {
    remove(this.#pointView);
    remove(this.#formView);
  }
}
