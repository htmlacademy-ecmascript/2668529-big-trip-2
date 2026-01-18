import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';

function humanizePointDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function humanizePointTime(date) {
  return date ? dayjs(date).format(TIME_FORMAT) : '';
}

function humanizeDateTime(date) {
  return date ? dayjs(date).format(DATE_TIME_FORMAT) : '';
}

function getEventDuration(dateFrom, dateTo) {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const diffMinutes = end.diff(start, 'minute');
  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
  const minutes = diffMinutes % 60;

  const format = (value) => String(value).padStart(2, '0');
  const durationParts = [];

  if (days > 0) {
    durationParts.push(`${format(days)}D`);
  }
  if (hours > 0 || days > 0) {
    durationParts.push(`${format(hours)}H`);
  }
  durationParts.push(`${format(minutes)}M`);
  return durationParts.join(' ');
}

const isFuture = (point) => dayjs(point.dateFrom).isAfter(dayjs());

const isPast = (point) => dayjs(point.dateTo).isBefore(dayjs());

const isPresent = (point) => {
  const now = dayjs();
  const start = dayjs(point.dateFrom);
  const end = dayjs(point.dateTo);

  return (start.isBefore(now) || start.isSame(now)) && (end.isAfter(now) || end.isSame(now));
};

const sortByDay = (a, b) =>
  dayjs(a.dateFrom) - dayjs(b.dateFrom);

const sortByTime = (a, b) => {
  const durationA = dayjs(a.dateTo).diff(dayjs(a.dateFrom));
  const durationB = dayjs(b.dateTo).diff(dayjs(b.dateFrom));
  return durationB - durationA;
};

const sortByPrice = (a, b) =>
  b.basePrice - a.basePrice;

export { humanizePointDate, humanizePointTime, humanizeDateTime, getEventDuration,
  isFuture, isPast, isPresent, sortByDay, sortByTime, sortByPrice};
