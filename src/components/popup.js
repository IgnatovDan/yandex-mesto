class Popup {
  constructor(popupSelector) {
    this._popupElement = document.querySelector(`.${popupSelector}`);
  }

  setEventListeners() {
    this._popupElement.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('popup') || evt.target.classList.contains('popup__close')) {
        this.close();
      }
    });
  }

  open() {
    this._popupElement.classList.add('popup_is-opened');
    document.addEventListener('keyup', (evt) => {
      evt.preventDefault();
      if (evt.which === 27) this.close()
    });
  }

  close() {
    this._popupElement.classList.remove('popup_is-opened');
  }
}

export default Popup;
