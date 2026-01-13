/**
 * Определяет доступность фильтров на основе точек маршрута
 * @param {Array} points - Массив точек маршрута
 * @returns {Object} Объект с информацией о доступности фильтров
 */
export function generateFilterData(points) {
  const now = new Date();

  const hasFuture = points.some((point) => new Date(point.dateFrom) > now);
  const hasPresent = points.some((point) => {
    const from = new Date(point.dateFrom);
    const to = new Date(point.dateTo);
    return from <= now && to >= now;
  });
  const hasPast = points.some((point) => new Date(point.dateTo) < now);

  return {
    everything: { disabled: false, checked: true },
    future: { disabled: !hasFuture, checked: false },
    present: { disabled: !hasPresent, checked: false },
    past: { disabled: !hasPast, checked: false }
  };
}

/**
 * Получает сообщение для пустого состояния в зависимости от выбранного фильтра
 * @param {string} filterType - Тип фильтра ('everything', 'future', 'present', 'past')
 * @returns {string} Текст сообщения
 */
export function getEmptyMessage(filterType = 'everything') {
  const messages = {
    everything: 'Click New Event to create your first point',
    future: 'There are no future events now',
    present: 'There are no present events now',
    past: 'There are no past events now'
  };

  return messages[filterType] || messages.everything;
}
