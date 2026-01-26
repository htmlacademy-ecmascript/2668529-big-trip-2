import {remove, render, RenderPosition} from '../framework/render.js';
import FormView from '../view/form-view.js';
import {UserAction, UpdateType, POINTS_TYPE} from '../const.js';
import {nanoid} from 'nanoid';

const BLANK_POINT = {
  id: null,
  type: POINTS_TYPE[0],
  destination: '',
  dateFrom: new Date(),
  dateTo: new Date(),
  basePrice: 0,
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
      offers: [],
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

  #handleFormSubmit = (point) => {
    const pointWithId = { ...point, id: nanoid() };
    this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MINOR, pointWithId);
    this.destroy();
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
