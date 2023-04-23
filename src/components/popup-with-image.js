import Popup from './popup.js';
import {popupImageElement, popupImageElementCaption} from '../utils/constants.js';

class PopupWithImage extends Popup {
  open({ link, name }) {
    popupImageElementCaption.textContent = name;
    popupImageElement.src = link;
    this._popupElement.classList.add('popup_is-opened');
    document.addEventListener('keyup', (evt) => {
      evt.preventDefault();
      if (evt.which === 27)
        this.close()
    });
  }
}

export default PopupWithImage;
