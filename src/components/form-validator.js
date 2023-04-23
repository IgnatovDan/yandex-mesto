class FormValidator {
  // review: название аргумента popupSelector не соответствует названию класса FormValidator
  //    а сама форма для валидации может быть расположена не только в popup
  //    нужно изменить название аргумента на formSelector
  constructor(config, popupSelector) {
    this._inputSelector = config.inputSelector;
    this._submitButtonSelector = config.submitButtonSelector;
    this._inactiveButtonClass = config.inactiveButtonClass;
    this._inputErrorClass = config.inputErrorClass;
    this._errorClass = config.errorClass;

    this._element = document.querySelector(`.${popupSelector}`);
  }

  _checkInputValidity(inputElement) {
    if (!inputElement.validity.valid) {
      this._showInputError(inputElement, inputElement.validationMessage);
    } else {
      this._hideInputError(inputElement);
    }
  }

  _showInputError(inputElement, errorMessage) {
    const errorElement = this._element.querySelector(`#${inputElement.id}-error`);

    inputElement.classList.add(this._inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(this._errorClass);
  }

  _hideInputError(inputElement) {
    const errorElement = this._element.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(this._inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(this._errorClass);
  }

  _toggleButtonState() {
    if (this._getInvalidInput()) {
      this._buttonElement.classList.add(this._inactiveButtonClass);
      this._buttonElement.disabled = true;
    } else {
      this._buttonElement.classList.remove(this._inactiveButtonClass);
      this._buttonElement.disabled = false;
    }
  }

  _getInvalidInput() {
    return this._inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  }

  _setEventListeners() {
    this._inputList = Array.from(this._element.querySelectorAll(this._inputSelector));
    this._buttonElement = this._element.querySelector(this._submitButtonSelector);

    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        this._checkInputValidity(inputElement);
        this._toggleButtonState();
      });
    });
  }

  enableValidation() {
    // review: на каждом вызове метода enableValidation (сейчас это каждое открытие popup) 
    //    происходит добавление еще одного обработчика на событие
    //    нужно использовать другие методы, гарантирующие один обработчик для события
    //    например добавление обработчика в конструкторе
    this._element.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });

    // review: на каждом вызове метода происходит добавление новых обработчиков событий внутри метода _setEventListeners
    //    нужно использовать другие методы, гарантирующие один обработчик для события
    //    например добавление обработчиков в конструкторе
    this._setEventListeners();
  }
}

export default FormValidator;
