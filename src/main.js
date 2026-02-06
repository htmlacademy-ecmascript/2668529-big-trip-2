import TripPresenter from './presenter/trip-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render } from './framework/render.js';
import PointsApiService from './api/points-api-service.js';
import OffersApiService from './api/offers-api-service.js';
import DestinationsApiService from './api/destinations-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1hkdf3463Taskdef2j';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const tripMainContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const offersModel = new OffersModel({
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION)
});

const destinationsModel = new DestinationsModel({
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();

const tripInfoPresenter = new TripInfoPresenter({
  tripInfoContainer: tripMainContainer,
  pointsModel,
  offersModel,
  destinationsModel
});

const tripPresenter = new TripPresenter({
  tripEventsContainer,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});
const filterPresenter = new FilterPresenter({
  filtersContainer: filtersContainer, filterModel, pointsModel
});
const newPointButtonComponent = new NewPointButtonView({ onClick: handleNewPointButtonClick });

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  tripPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

filterPresenter.init();
tripPresenter.init();
setTimeout(() => {
  pointsModel.init();
  offersModel.init();
  destinationsModel.init();
  tripInfoPresenter.init();
  render(newPointButtonComponent, tripMainContainer);
}, 0);
