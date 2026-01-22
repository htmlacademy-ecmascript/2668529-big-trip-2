import { render, remove, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from '../presenter/point-presenter.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { sortByDay, sortByTime, sortByPrice } from '../utils/date-time.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #allDestinations = [];
  #eventList = new PointListView();
  #emptyList = new EmptyListView();
  #sortComponent = null;
  #allPointPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor({ tripEventsContainer, pointsModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get tripPoints() {
    const points = [...this.#pointsModel.points];

    switch (this.#currentSortType) {
      case SortType.DAY:
        return points.sort(sortByDay);
      case SortType.TIME:
        return points.sort(sortByTime);
      case SortType.PRICE:
        return points.sort(sortByPrice);
    }

    return points;
  }

  init() {
    this.#allDestinations = [...this.#pointsModel.destinations];
    this.#renderApp();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderEmptyList() {
    render(this.#emptyList, this.#tripEventsContainer);
  }

  #renderEventList() {
    render(this.#eventList, this.#tripEventsContainer);
  }

  #renderPoints() {
    this.tripPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      eventList: this.#eventList,
      pointsModel: this.#pointsModel,
      allDestinations: this.#allDestinations,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#allPointPresenters.set(point.id, pointPresenter);
  }

  #renderApp() {
    if (this.tripPoints.length === 0) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();
    this.#renderEventList();
    this.#renderPoints();
  }

  #clearEventList() {
    this.#allPointPresenters.forEach((presenter) => presenter.destroy());
    this.#allPointPresenters.clear();
  }

  #handleSortTypeChange = (newSortType) => {
    if (this.#currentSortType === newSortType) {
      return;
    }
    this.#currentSortType = newSortType;
    this.#clearEventList();
    remove(this.#sortComponent);
    this.#renderSort();
    this.#renderPoints();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#allPointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.#clearEventList();
        this.#renderPoints();
        break;
    }
  };

  #handleModeChange = () => {
    this.#allPointPresenters.forEach((presenter) => presenter.resetView());
  };
}
