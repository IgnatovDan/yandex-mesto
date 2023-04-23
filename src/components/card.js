class Card {
  constructor({ data, handleCardClick, handleLikeClick, handleDeleteIconClick }) {
    this._text = data.name;
    this._link = data.link;
    this._likes = data.likes;
    this._userId = data.currentUserId;
    this._ownerId = data.owner._id;
    this._cardId = data._id;

    this._handleCardClick = handleCardClick;
    this._handleLikeClick = handleLikeClick;
    this._handleDeleteIconClick = handleDeleteIconClick;
  }

  // review: метод не используется
  removeCard() {
    // review: у метода есть скрытая зависимость от последовательности вызовов других методов: успешный вызов этого метода 
    //    возможен только после вызова метода getView в котором присваивается значение в this._element
    this._element.remove();
  }

  // review: некорректное название метода: слово 'get' подразумевает получение одного и того же логического результата при повторных вызовах без посторонних эффектов,
  //    а код метода выполняет много дополнительных действий, меняет внутреннее состояние объекта и возвращает новый логический результат при каждом вызове
  //    Для такого кода подходит название 'create/generate', или перенос кода в конструктор (специальное средство языка для однократного выполнения кода в объекте)
  //    Подробнее в разделе "Добавление данных в разметку и размещение в DOM"
  getView() {
    // review: некорректная инициализация значений: объект предназначен для работы с одним и тем же DOM элементом,
    //    на который ссылается свойство _element
    //    и повторный вызов метода неявно сломает это поведение (removeCard перестанет удалять предыдущие созданные элементы)
    // review: фиксированные строковые константы для поиска темплейта [card-template и card] и сам способ получения DOM элемента именно через темплейт
    //    не должны быть расположены внутри этого класса, они увеличивают зависимость этого класса от внешнего окружения
    //    DOM элемент карточки лучше создать снаружи этого класса и передать его например в конструктор
    this._element = document
      .querySelector('.card-template')
      .content
      .querySelector('.card')
      .cloneNode(true);

    this._element.querySelector('.card__like-button')
      .addEventListener('click', () => this._handleLikeClick(this));

    this._element.querySelector('.card__delete-button')
      .addEventListener('click', () => this._handleDeleteIconClick(this));

    this._element.querySelector('.card__image')
      .addEventListener('click', () => this._handleCardClick({
        name: this._text,
        src: this._link
      }));

    // review: сделано повторное получение DOM элемента через querySelector.
    //  нужно сохранить ссылку на первом поиске и обращаться к ней вместо нового поиска: селектор возвращает один и тот же DOM элемент
    this._element.querySelector('.card__delete-button')
      .classList.add(this._userId === this._ownerId ? 'card__delete-button_visible' : 'card__delete-button_hidden');

    // review: сделано повторное получение DOM элемента через querySelector.
    this._element.querySelector('.card__image').style.backgroundImage = `url(${this._link})`;

    // review: использован innerHTML, который позволяет внедрять на страницу разметку из пользовательских текстов
    //    вместо него нужно использовать textContent
    this._element.querySelector('.card__title').innerHTML = this._text;

    // review: использован innerHTML, который позволяет внедрять на страницу разметку из пользовательских текстов
    //    вместо него нужно использовать textContent
    this._element.querySelector('.card__like-count').innerHTML = this._likes.length;

    // review: сделано повторное получение DOM элемента через querySelector
    // review: сделано некорректное оформление кода с длинной цепочкой вызовов через '.' и разрывом цепочки на несколько строк.
    //    такие переносы внутри if труднее понимать чем код с короткими выражениями
    if (this.isLiked()) this._element.querySelector('.card__like-button')
      .classList.add('card__like-button_is-active');
    else this._element.querySelector('.card__like-button')
      // review: продублирована строковая константа в коде
      //    нужно убрать дублирование: добавить новую const переменную
      // review: можно использовать classList.toggle(className, force) вместо add/remove
      .classList.remove('card__like-button_is-active');

    return this._element;
  }

  isLiked() {
    return Boolean(this._likes.find(item => item._id === this._userId));
  }

  id() {
    return this._cardId;
  }

  setLikesInfo(data) {
    // review: класс инкапсулирует логику работы c DOM элементами (сделан как ViewController в архитектуре MVC) 
    //    и этот метод должен сразу обновить значение DOM элемента `card__like-count`
    //    это обновление не должно выполняться внешним кодом
    this._likes = data.likes;
  }

  getElement() {
    return this._element;
  }
}

export default Card;
