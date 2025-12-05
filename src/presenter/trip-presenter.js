import { render, RenderPosition } from '../render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import NewFormView from '../view/new-form-view.js';
import EventView from '../view/event-view.js';

export default class TripPresenter {
  constructor(filtersContainer, tripEventsContainer) {
    this.filtersContainer = filtersContainer;
    this.tripEventsContainer = tripEventsContainer;
    this.contentListElement = null;
  }

  init() {

    render(new FilterView(), this.filtersContainer, RenderPosition.BEFOREEND);
    render(new SortView(), this.tripEventsContainer, RenderPosition.AFTERBEGIN);

    this.contentListElement = document.createElement('ul');
    this.contentListElement.classList.add('trip-events__list');
    this.tripEventsContainer.appendChild(this.contentListElement);

    render(new NewFormView(), this.contentListElement);
    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.contentListElement);
    }
  }
}
