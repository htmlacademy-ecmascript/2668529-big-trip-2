import { render, replace, RenderPosition, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import FormView from '../view/form-view.js';
import { UpdateType, UserAction } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #eventList = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #point = null;
  #pointView = null;
  #formView = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ eventList, pointsModel, offersModel, destinationsModel, onDataChange, onModeChange }) {
    this.#eventList = eventList;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const destination = this.#destinationsModel.getDestinationById(point.destination);
    const offers = this.#offersModel.getOffersByType(point.type).filter((offer) => point.offers.includes(offer.id));
    const formOffers = this.#offersModel.getOffersByType(point.type) || [];
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
      selectedOffers: point.offers.filter((id) => formOffers.some((offer) => offer.id === id)),
      destination,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
      onDeleteClick: this.#handleDeleteClick
    });

    if (!prevPointView && !prevFormView) {
      render(this.#pointView, this.#eventList.element, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointView, prevPointView);
    } else {
      replace(this.#formView, prevFormView);
      this.#replaceFormToPoint();
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

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#formView.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#formView.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.EDITING) {
      this.#formView.shake(() => {
        this.#formView.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      });
      return;
    }
    this.#pointView.shake();
  }

  #replacePointToForm() {
    this.#handleModeChange();
    replace(this.#formView, this.#pointView);
    document.addEventListener('keydown', this.#handleFormEscKeyDown);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }
    this.#formView.updateElement({
      point: this.#point,
      selectedOffers: this.#point.offers,
      destination: this.#destinationsModel.getDestinationById(this.#point.destination)
    });
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
    this.#replacePointToForm();
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.PATCH, updatedPoint);
  };

  #handleFavouriteClick = () => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };
}
