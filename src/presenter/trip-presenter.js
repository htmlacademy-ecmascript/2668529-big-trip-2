import { render, remove, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from '../presenter/point-presenter.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { sortByDay, sortByTime, sortByPrice } from '../utils/date-time.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #tripPoints = [];
  #allDestinations = [];
  #eventList = new PointListView();
  #emptyList = new EmptyListView();
  #sortComponent = null;
  #allPointPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor({ tripEventsContainer, pointsModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.points];
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
    this.#tripPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      eventList: this.#eventList,
      pointsModel: this.#pointsModel,
      allDestinations: this.#allDestinations,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#allPointPresenters.set(point.id, pointPresenter);
  }

  #renderApp() {
    if (this.#tripPoints.length === 0) {
      this.#renderEmptyList();
      return;
    }
    this.#sortPoints(this.#currentSortType);
    this.#renderSort();
    this.#renderEventList();
    this.#renderPoints();
  }

  #clearEventList() {
    this.#allPointPresenters.forEach((presenter) => presenter.destroy());
    this.#allPointPresenters.clear();
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#tripPoints.sort(sortByDay);
        break;

      case SortType.TIME:
        this.#tripPoints.sort(sortByTime);
        break;

      case SortType.PRICE:
        this.#tripPoints.sort(sortByPrice);
        break;
    }
  }

  #handleSortTypeChange = (newSortType) => {
    if (this.#currentSortType === newSortType) {
      return;
    }
    this.#currentSortType = newSortType;
    this.#sortPoints(newSortType);
    this.#clearEventList();
    remove(this.#sortComponent);
    this.#renderSort();
    this.#renderPoints();
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#allPointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#allPointPresenters.forEach((presenter) => presenter.resetView());
  };
}
