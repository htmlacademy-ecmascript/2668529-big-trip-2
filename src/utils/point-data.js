import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

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

export {getRandomArrayElement, humanizePointDate, humanizePointTime, humanizeDateTime, getEventDuration};
