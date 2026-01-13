import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import FilterView from './view/filter-view.js';
import { generateFilterData } from './utils/filter.js';
import { FilterType } from './const.js';
import { render } from './framework/render.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({tripEventsContainer, pointsModel});

const filters = generateFilterData(pointsModel.points);
render(new FilterView({ filters, currentFilterType: FilterType.EVERYTHING }), filtersContainer);
tripPresenter.init();
