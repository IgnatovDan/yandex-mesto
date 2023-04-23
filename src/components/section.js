import { cardsConfig } from '../utils/constants.js';

class Section {
  constructor({ renderer }) {
    this._renderer = renderer;
    // review: использована глобальная константа cardsConfig. Такой подход увеличивает связность кода. 
    //    Вместо прямого обращения к внешнему окружению нужно передавать значение через аргументы функции.
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
