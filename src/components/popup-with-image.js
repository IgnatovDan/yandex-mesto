import Popup from './popup.js';
import {popupImageElement, popupImageElementCaption} from '../utils/constants.js';

class PopupWithImage extends Popup {
  open({ link, name }) {
    // review: используется глобальная переменная popupImageElementCaption для обращения к DOM элементу.
    //    Этот элемент является внутренней деталью реализации блока popup_type_image
    //    и не должен быть доступен внешнему коду.
    //    Нужно перенести глобальную переменную в этот класс (например в конструктор)
    //    и передавать из внешнего кода только селектор или корневой элемент блока popup_type_image
    popupImageElementCaption.textContent = name;
    // review: используется глобальная переменная popupImageElement для обращения к DOM элементу.
    //    Этот элемент является внутренней деталью реализации блока popup_type_image
    //    и не должен быть доступен внешнему коду.
    // review: для тега img нужно задать значение атрибута alt, это контентное изображение
    //    и для него нужно сделать пояснение через alt или другим способом.
    popupImageElement.src = link;
    // review: этот код управления classList дублирует код Popup.open
    //    нужно использовать метод базового класса
    this._popupElement.classList.add('popup_is-opened');
    // review: этот код управления keyup дублирует код Popup.open
    //    нужно использовать метод базового класса
    document.addEventListener('keyup', (evt) => {
      evt.preventDefault();
      if (evt.which === 27)
        this.close()
    });
  }
}

export default PopupWithImage;
