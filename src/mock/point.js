import {getRandomArrayElement} from '../utils.js';

const mockPoints = [
  {
    'id': 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    'base_price': 1100,
    'date_from': '2019-07-10T22:55:56.845Z',
    'date_to': '2019-07-11T11:22:13.375Z',
    'destination': 'bfa5cb75-a1fe-4b77-a83c-0e528e910e04',
    'is_favorite': false,
    'offers': [
      'b4c3e4e6-9053-42ce-b747-e281314baa31'
    ],
    'type': 'taxi'
  },
  {
    'id': 'f4b62099-293f-4c3d-a702-94eec4a2808kj',
    'base_price': 1300,
    'date_from': '2019-06-10T22:55:56.845Z',
    'date_to': '2019-06-11T11:22:13.375Z',
    'destination': 'bfa5cb75-a1fe-4b77-a83c-0e528e910e041',
    'is_favorite': false,
    'offers': [
      'b4c3e4e6-9053-42ce-b747-e281314baa31'
    ],
    'type': 'taxi'
  },
  {
    'id': 'f4b62099-293f-4c3d-a702-94eec4a2808hgf',
    'base_price': 250000,
    'date_from': '2019-08-10T22:55:56.845Z',
    'date_to': '2019-08-11T11:22:13.375Z',
    'destination': 'bfa5cb75-a1fe-4b77-a83c-0e528e910e042',
    'is_favorite': false,
    'offers': [
      'b4c3e4e6-9053-42ce-b747-e281314baa31'
    ],
    'type': 'taxi'
  },
  {
    'id': 'f4b62099-293f-4c3d-a702-94eec4a2808785',
    'base_price': 11000,
    'date_from': '2019-09-10T22:55:56.845Z',
    'date_to': '2019-09-11T11:22:13.375Z',
    'destination': 'bfa5cb75-a1fe-4b77-a83c-0e528e910e049',
    'is_favorite': true,
    'offers': [
      'b4c3e4e6-9053-42ce-b747-e281314baa31'
    ],
    'type': 'taxi'
  }
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export {getRandomPoint};
