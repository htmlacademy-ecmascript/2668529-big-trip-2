import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class DestinationsModel extends Observable {
  #destinationsApiService = null;
  #destinations = [];

  constructor({ destinationsApiService }) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
      this._notify(UpdateType.LOADING_ERROR);
      return;
    }
    this._notify(UpdateType.INIT);
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
