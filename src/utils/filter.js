import { isFuture, isPast, isPresent } from './date-time.js';
import { FilterType } from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(isFuture),
  [FilterType.PAST]: (points) => points.filter(isPast),
  [FilterType.PRESENT]: (points) => points.filter(isPresent)
};

function generateFilterData(points) {
  return Object.values(FilterType).map((type) => ({
    type,
    count: filter[type](points).length
  }));
}

export { filter, generateFilterData };
