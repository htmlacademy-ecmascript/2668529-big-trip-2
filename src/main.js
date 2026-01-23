import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import FilterView from './view/filter-view.js';
import FilterModel from './model/filter-model.js';
//import { generateFilterData } from './utils/filter.js';
import { FilterType } from './const.js';
import { render } from './framework/render.js';

const filters = [
  {
    type: 'everything',
    count: 0,
  },
];

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const tripPresenter = new TripPresenter({tripEventsContainer, pointsModel});

//const filters = generateFilterData(pointsModel.points);
render(new FilterView({ filters, currentFilterType: FilterType.EVERYTHING, onFilterTypeChange: () => {} }), filtersContainer);
tripPresenter.init();
