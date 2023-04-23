import Popup from './popup.js';
import FormValidator from './form-validator.js';
import { defaultFormConfig} from '../utils/constants.js';

class PopupWithForm extends Popup {
  constructor({ popupSelector, handleFormSubmit, popupConfig }) {
    super(popupSelector);

    this._popupConfig = popupConfig;
    this._validator = new FormValidator(defaultFormConfig, popupConfig);

    this._popupForm = this._popupElement.querySelector('.popup__form');
    this._handleFormSubmit = handleFormSubmit;
  }

  _getInputValues() {
    this._inputList = this._popupElement.querySelectorAll('.popup_input');

    if (this._popupConfig === 'popup_type_edit') {
      return {
        userName: this._inputList[0].value,
        userDescription: this._inputList[1].value
      }
    }

    if (this._popupConfig === 'popup_type_new-card') {
      return {
        name: this._inputList[0].value,
        link: this._inputList[1].value
      }
    }

    if (this._popupConfig === 'popup__edit-avatar') {
      return {
        avatar: this._inputList[0].value
      }
    }
  }

  open() {
    this._validator.enableValidation();
    super.open();
  }

  setEventListeners() {
    this._popupElement.addEventListener('submit', () => {
      this._handleFormSubmit(this._getInputValues());
      this.close();
    });

    super.setEventListeners();
  }
}

export default PopupWithForm;
