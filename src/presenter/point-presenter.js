import { render, replace, RenderPosition, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import FormView from '../view/form-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #eventList = null;
  #pointsModel = null;
  #point = null;
  #pointView = null;
  #formView = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ eventList, pointsModel, onDataChange, onModeChange }) {
    this.#eventList = eventList;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offers = this.#pointsModel.getOffersByType(point.type).filter((offer) => point.offers.includes(offer.id));
    const formOffers = this.#pointsModel.getOffersByType(point.type);
    const prevPointView = this.#pointView;
    const prevFormView = this.#formView;

    this.#pointView = new PointView({
      point,
      offers,
      destination,
      onEditClick: this.#handleEditClick,
      onFavouriteClick: this.#handleFavouriteClick
    });

    this.#formView = new FormView({
      point,
      offers: formOffers,
      selectedOffers: point.offers,
      destination,
      onSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick
    });

    if (!prevPointView && !prevFormView) {
      render(this.#pointView, this.#eventList.element, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointView, prevPointView);
    } else {
      replace(this.#formView, prevFormView);
    }

    remove(prevPointView);
    remove(prevFormView);
  }

  destroy() {
    remove(this.#pointView);
    remove(this.#formView);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    replace(this.#formView, this.#pointView);
    document.addEventListener('keydown', this.#handleFormEscKeyDown);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }
    replace(this.#pointView, this.#formView);
    document.removeEventListener('keydown', this.#handleFormEscKeyDown);
    this.#mode = Mode.DEFAULT;
  }

  #handleFormEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#handleModeChange();
    this.#replacePointToForm();
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#handleDataChange(updatedPoint);
    this.#replaceFormToPoint();
  };

  #handleFavouriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
