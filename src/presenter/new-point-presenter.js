import { remove, render, RenderPosition } from '../framework/render.js';
import FormView from '../view/form-view.js';
import { UserAction, UpdateType } from '../const.js';

const BLANK_POINT = {
  id: null,
  type: 'flight',
  destination: null,
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  isFavorite: false,
  offers: []
};

export default class NewPointPresenter {
  #eventList = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #formView = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  constructor({ eventList, onDataChange, onDestroy, pointsModel, offersModel, destinationsModel }) {
    this.#eventList = eventList;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    if (this.#formView !== null) {
      return;
    }

    this.#formView = new FormView({
      point: BLANK_POINT,
      offers: this.#offersModel.getOffersByType(BLANK_POINT.type),
      selectedOffers: [],
      destination: null,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick
    });

    render(this.#formView, this.#eventList.element, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (!this.#formView) {
      return;
    }
    remove(this.#formView);
    this.#formView = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#handleDestroy?.();
  }

  setSaving() {
    this.#formView.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    this.#formView.shake(() => {
      this.#formView.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    });
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MINOR, point);
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
