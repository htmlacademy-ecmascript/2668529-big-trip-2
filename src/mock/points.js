import {getRandomArrayElement} from '../utils/point-data.js';

const mockPoints = [
  {
    id: 'point-1',
    basePrice: 1100,
    dateFrom: '2025-07-10T22:55:56.845Z',
    dateTo: '2025-07-11T11:22:13.375Z',
    destination: 'dest-1',
    isFavorite: false,
    offers: [
      'of-taxi-1',
      'of-taxi-2'
    ],
    type: 'taxi'
  },
  {
    id: 'point-2',
    basePrice: 1300,
    dateFrom: '2026-01-25T22:55:56.845Z',
    dateTo: '2026-01-26T11:22:13.375Z',
    destination: 'dest-2',
    isFavorite: false,
    offers: ['of-bus-1'],
    type: 'bus'
  },
  {
    id: 'point-3',
    basePrice: 2500,
    dateFrom: '2026-01-12T22:55:56.845Z',
    dateTo: '2026-01-13T11:22:13.375Z',
    destination: 'dest-3',
    isFavorite: true,
    offers: ['of-drive-1'],
    type: 'drive'
  },
  {
    id: 'point-4',
    basePrice: 2200,
    dateFrom: '2025-09-01T09:00:00.000Z',
    dateTo: '2025-09-01T12:00:00.000Z',
    destination: 'dest-1',
    isFavorite: false,
    offers: [
      'of-flight-1',
      'of-flight-2'
    ],
    type: 'flight'
  },
  {
    id: 'point-5',
    basePrice: 800,
    dateFrom: '2019-10-05T14:00:00.000Z',
    dateTo: '2019-10-05T16:30:00.000Z',
    destination: 'dest-2',
    isFavorite: true,
    offers: ['of-sightseeing-1'],
    type: 'sightseeing'
  },
  {
    id: 'point-6',
    basePrice: 900,
    dateFrom: '2025-11-01T10:00:00.000Z',
    dateTo: '2025-12-01T12:00:00.000Z',
    destination: 'dest-3',
    isFavorite: false,
    offers: [],
    type: 'bus'
  }
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export { getRandomPoint };
