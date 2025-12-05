import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import {render} from './render.js';

const mainTripElement = document.querySelector('.trip-main');
const eventsElement = document.querySelector('.trip-events');

render(new FilterView(), mainTripElement);
render(new SortView(), eventsElement);
