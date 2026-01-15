import { render, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from '../presenter/point-presenter.js';
import { updateItem } from '../utils/common.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #tripPoints = [];
  #eventList = new PointListView();
  #emptyListView = new EmptyListView();
  #sortComponent = new SortView();
  #allPointPresenters = new Map();

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
    const pointPresenter = new PointPresenter({
      eventList: this.#eventList,
      pointsModel: this.#pointsModel
    });
    pointPresenter.init(point);
    this.#allPointPresenters.set(point.id, pointPresenter);
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

  #clearEventList() {
    this.#allPointPresenters.forEach((presenter) => presenter.destroy());
    this.#allPointPresenters.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#allPointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

}
