import { FilterType } from '../const.js';
import { isFuture, isPast, isPresent } from './date-time.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPast(point)),
};

/**
 * Генерирует массив фильтров с количеством точек для каждого
 * @param {Array} points - Массив точек маршрута
 * @returns {Array} Массив объектов фильтров с type и count
 */
export function generateFilterData(points) {
  return [
    {
      type: FilterType.EVERYTHING,
      count: points.length
    },
    {
      type: FilterType.FUTURE,
      count: filter[FilterType.FUTURE](points).length
    },
    {
      type: FilterType.PRESENT,
      count: filter[FilterType.PRESENT](points).length
    },
    {
      type: FilterType.PAST,
      count: filter[FilterType.PAST](points).length
    }
  ];
}

/**
 * Получает сообщение для пустого состояния в зависимости от выбранного фильтра
 * @param {string} filterType - Тип фильтра ('everything', 'future', 'present', 'past')
 * @returns {string} Текст сообщения
 */
export function getEmptyMessage(filterType = FilterType.EVERYTHING) {
  const messages = {
    [FilterType.EVERYTHING]: 'Click New Event to create your first point',
    [FilterType.FUTURE]: 'There are no future events now',
    [FilterType.PRESENT]: 'There are no present events now',
    [FilterType.PAST]: 'There are no past events now'
  };

  return messages[filterType] || messages[FilterType.EVERYTHING];
}

export { filter };
