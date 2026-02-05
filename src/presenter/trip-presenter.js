import { render, remove, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from '../presenter/point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import LoadingErrorView from '../view/loading-error-view.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortByDay, sortByTime, sortByPrice } from '../utils/date-time.js';
import { filter } from '../utils/filter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #emptyList = null;
  #sortComponent = null;
  #newPointPresenter = null;
  #loadingErrorComponent = new LoadingErrorView();
  #loadingComponent = new LoadingView();
  #eventList = new PointListView();
  #allPointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #loadedModelsCount = 0;
  #isLoading = true;
  #isLoadingError = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });


  constructor({ tripEventsContainer, pointsModel, offersModel, destinationsModel, filterModel, onNewPointDestroy }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = new NewPointPresenter({
      eventList: this.#eventList,
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get tripPoints() {
    const points = [...this.#pointsModel.points];
    this.#filterType = this.#filterModel.filter;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints;
  }

  init() {
    this.#renderApp();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#handleModeChange();

    if (this.#loadingErrorComponent) {
      remove(this.#loadingErrorComponent);
      this.#isLoadingError = false;
    }

    if (this.#emptyList) {
      remove(this.#emptyList);
      this.#emptyList = null;
    }

    this.#newPointPresenter.init();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripEventsContainer);
  }

  #renderLoadingError() {
    render(this.#loadingErrorComponent, this.#tripEventsContainer);
  }

  #renderEmptyList() {
    this.#emptyList = new EmptyListView({filterType: this.#filterType });
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
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#allPointPresenters.set(point.id, pointPresenter);
  }

  #renderApp() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderEventList();

    if (this.#isLoadingError) {
      this.#renderLoadingError();
      return;
    }

    if (this.tripPoints.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  }

  #clearEventList() {
    this.#allPointPresenters.forEach((presenter) => presenter.destroy());
    this.#allPointPresenters.clear();
  }

  #clearApp() {
    this.#clearEventList();
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#emptyList);
    remove(this.#eventList);
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#allPointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#allPointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#allPointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#allPointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#clearEventList();
        this.#renderPoints();
        break;
      case UpdateType.MINOR:
        this.#newPointPresenter.destroy();
        this.#clearApp();
        this.#renderApp();
        break;
      case UpdateType.MAJOR:
        this.#currentSortType = SortType.DAY;
        this.#clearApp();
        this.#renderApp();
        break;
      case UpdateType.INIT:
        this.#loadedModelsCount += 1;
        if (this.#loadedModelsCount < 3) {
          return;
        }
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderApp();
        break;
      case UpdateType.LOADING_ERROR:
        this.#isLoading = false;
        this.#isLoadingError = true;
        remove(this.#loadingComponent);
        this.#renderApp();
        break;
    }
  };

  #handleModeChange = () => {
    this.#allPointPresenters.forEach((presenter) => presenter.resetView());
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }
  };
}
