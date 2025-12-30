import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import FilterView from './view/filter-view.js';
import { render } from './render.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();

const tripPresenter = new TripPresenter({
  tripEventsContainer,
  pointsModel
});

render(new FilterView(), filtersContainer);
tripPresenter.init();
