import { nanoid } from 'nanoid';

export const mockPoints = [
  {
    id: nanoid(),
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
    id: nanoid(),
    basePrice: 1300,
    dateFrom: '2026-01-25T22:55:56.845Z',
    dateTo: '2026-01-26T11:22:13.375Z',
    destination: 'dest-2',
    isFavorite: false,
    offers: ['of-bus-1'],
    type: 'bus'
  },
  {
    id: nanoid(),
    basePrice: 2500,
    dateFrom: '2026-01-13T00:55:56.845Z',
    dateTo: '2026-01-14T11:22:13.375Z',
    destination: 'dest-3',
    isFavorite: true,
    offers: ['of-drive-1'],
    type: 'drive'
  },
  {
    id: nanoid(),
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
    id: nanoid(),
    basePrice: 800,
    dateFrom: '2026-01-30T14:00:00.000Z',
    dateTo: '2026-02-01T16:30:00.000Z',
    destination: 'dest-2',
    isFavorite: true,
    offers: ['of-sightseeing-1'],
    type: 'sightseeing'
  },
  {
    id: nanoid(),
    basePrice: 900,
    dateFrom: '2025-11-01T10:00:00.000Z',
    dateTo: '2025-12-01T12:00:00.000Z',
    destination: 'dest-3',
    isFavorite: false,
    offers: [],
    type: 'bus'
  },
  {
    id: nanoid(),
    basePrice: 11252,
    dateFrom: '2026-01-20T00:00:00.000Z',
    dateTo: '2026-01-20T12:00:00.000Z',
    destination: 'dest-4',
    isFavorite: true,
    offers: ['of-flight-1',
      'of-flight-2'],
    type: 'flight'
  }
];
