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
  #onDataChange = null;
  #onModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ eventList, pointsModel, onDataChange, onModeChange }) {
    this.#eventList = eventList;
    this.#pointsModel = pointsModel;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
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
      isNew: false,
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
    document.removeEventListener('keydown', this.#handleFormEscKeyDown);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    replace(this.#formView, this.#pointView);
    this.#mode = Mode.EDITING;
    document.addEventListener('keydown', this.#handleFormEscKeyDown);
  }

  #replaceFormToPoint() {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }
    replace(this.#pointView, this.#formView);
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#handleFormEscKeyDown);
  }

  #handleFormEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#onModeChange();
    this.#replacePointToForm();
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#onDataChange(updatedPoint);
    this.#replaceFormToPoint();
  };

  #handleFavouriteClick = () => {
    this.#onDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
