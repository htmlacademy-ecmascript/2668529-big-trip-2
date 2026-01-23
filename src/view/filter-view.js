import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

function createFilterItemTemplate(filter, currentFilterType) {
  const { type, count } = filter;
  const isChecked = type === currentFilterType ? 'checked' : '';
  const isDisabled = count === 0 ? 'disabled' : '';
  const labelText = type.charAt(0).toUpperCase() + type.slice(1);

  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}"
        ${isChecked}
        ${isDisabled}>
      <label class="trip-filters__filter-label" for="filter-${type}">
        ${labelText}
      </label>
    </div>
  `;
}

function createFiltersTemplate(filters, currentType) {
  const filterItemTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentType)).join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItemTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = FilterType.EVERYTHING;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilterType = FilterType.EVERYTHING, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
