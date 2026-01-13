const POINTS_TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const BLANK_POINT = {
  id: null,
  type: 'taxi',
  dateFrom: '2019-03-18T10:30',
  dateTo: '2019-03-18T11:00',
  basePrice: '',
  offers: [],
  destination: null,
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export { POINTS_TYPE, BLANK_POINT, FilterType };
