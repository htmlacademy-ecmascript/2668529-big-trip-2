import TripPresenter from './presenter/trip-presenter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter(filtersContainer, tripEventsContainer);

tripPresenter.init();
