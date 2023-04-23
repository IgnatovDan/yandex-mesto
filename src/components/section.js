import { cardsConfig } from '../utils/constants.js';

class Section {
  constructor({ renderer }) {
    this._renderer = renderer;
    this._container = document.querySelector(`.${cardsConfig.placesWrap}`);
  }

  renderItems(items) {
    items.forEach(item => {
      this._renderer(item);
    });
  }

  addItem(element) {
    this._container.append(element);
  }
}

export default Section;
