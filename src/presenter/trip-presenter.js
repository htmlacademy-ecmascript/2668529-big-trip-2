import { render, RenderPosition } from '../render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import NewFormView from '../view/new-form-view.js';
import EventListView from '../view/event-list-view.js';
import EventView from '../view/event-view.js';

export default class TripPresenter {
  constructor(filtersContainer, tripEventsContainer) {
    this.filtersContainer = filtersContainer;
    this.tripEventsContainer = tripEventsContainer;
  }

  init() {

    render(new FilterView(), this.filtersContainer, RenderPosition.BEFOREEND);
    render(new SortView(), this.tripEventsContainer, RenderPosition.AFTERBEGIN);
    render(new NewFormView(), this.tripEventsContainer);
    this.eventList = new EventListView();
    render(this.eventList, this.tripEventsContainer);
    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.eventList.getElement());
    }
  }
}
