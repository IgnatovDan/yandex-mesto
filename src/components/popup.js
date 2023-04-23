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
    // review: нет удаления добавленного обработчика события, еще один новый обработчик добавляется при каждом вызове этого метода
    document.addEventListener('keyup', (evt) => {
      // review: стандартная обработка событий не должна безусловно отключаться для любого события keyup
      //    нужно отключить ее только когда событие полностью обработано кодом этого обработчика
      //    и больше никак не должно обрабатываться
      evt.preventDefault();
      // review: 'evt.which' - использовано некорректное свойство для события keyup (вместо него можно использовать свойство key)
      //    https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event#event_properties
      if (evt.which === 27) this.close()
    });
  }

  close() {
    // review: повторно написана строковое значение. Вместо многократного написания таких строк
    //    нужно объявить одну константу с этим значением и везде ее использовать.
    this._popupElement.classList.remove('popup_is-opened');
  }
}

export default Popup;
