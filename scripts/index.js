// ! ОБЪЯВЛЯЕМ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ

// * блок Profile
const profile = document.querySelector('.profile');
const profileEditButton = profile.querySelector('.profile__edit-button');
const profileName = profile.querySelector('.profile__name');
const profileRegalia = profile.querySelector('.profile__regalia');
const profileAddButton = profile.querySelector('.profile__add-button');

// * popup Profile-Edit
const popupTypeProfileEdit = document.querySelector('.popup_type_profile-edit');
const popupCloseButton = document.querySelector('.popup__close-button');
- Класс 'popup__close-button' есть в нескольких элементах и результат поиска по этому классу зависит от их порядка в разметке поэтому такой поиск нельзя применять для поиска конкретного элемента.
Например, для вызова querySelector можно использовать переменную, которая ссылается на нужный popup: поиск будет только среди его дочерних элементов.
Так не потребуется делать уникальные на всю страницу селекторы для каждого элемента в каждом popup, уменьшится код html и js.
**Самостоятельно проверьте другие селекторы**
const popupInputTypeName = document.querySelector('.popup__input_type_name');
const popupInputTypeRegalia = document.querySelector('.popup__input_type_regalia');
const popupFormTypeUserInfo = document.querySelector('.popup__form_type_user-info');

// * попап добавления новой карточки
const popupTypeAddNewCard = document.querySelector('.popup_type_add-new-card');
const anotherCloseButton = document.querySelector('.another-close-button');
- Надо исправить: Название переменной не поясняет из какого popup этот элемент и для чего он. Нужно изменить название, что бы было понятно к какому popup относится элемент
например closeEditProfilePopupButton-- кнопка закрытия popup редактирования профиля
- Надо исправить: в названиях переменных не должно быть нумерации (например слова 'another'): в проекте будут появляться новые такие элементы и вместо нумераций используйте "самодокументированные" названия
- Надо исправить: в названиях классов не должно быть нумерации (например слова 'another'): в проекте будут появляться новые такие элементы и вместо нумераций используйте "самодокументированные" названия
const popupFormTypeAddCard = document.querySelector('.popup__form_type_add-card');
const inputCardTitle = document.querySelector('.popup__input_type_card-title');
const inputCardLink = document.querySelector('.popup__input_type_card-link');

// * секция cards, куда импортятся все карточки
const cardsSection = document.querySelector('.cards');

// * попап с большой фоткой
const photoPopup = document.querySelector('.photo-popup');

// * шаблон карточки
const cardTemplate = document.querySelector('#cards-template').content.cloneNode(true);
const like = cardTemplate.querySelector('.card__like-button');
const bin = cardTemplate.querySelector('.card__delete-card');

// ! ФУНКЦИИ

// ? БЛОК PROFILE И ИЗМЕНЕНИЕ ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ

// * объявляем функцию, которая вставляет и удаляет из HTML класс popup_opened
const togglePopupClass = popup => {
  popup.classList.toggle('popup_opened');
- Можно лучше: использовать две функции openPopup и closePopup с кодом classList.add('popup_opened') и classList.remove('popup_opened') для управления состоянием модальных окон, а не одну функцию с методом toggle.
При использовании методов openPopup и closePopup сразу видно, что мы делаем - открываем или закрываем попап, и это повышает читаемость/надежность кода
Так же сейчас в приложении нет элемента при нажатии на который попап меняет состояние сразу и с открытого на закрытое, и обратно(именно эта операция называется toggle)
}

// * объявляем функцию, которая закрывает попап по клику в любое место на экране, кроме самого попапа (класс эл-та popup__container)
const closePopupOnClick = event => {
  if (event.target !== event.currentTarget) {
    return;
  } togglePopupClass(event.target);
- Код не офорлен: новое действие в коде нужно располагать на новой строке
}

// * объявляем функцию, которая передает введенные в формы значения на обработку
const formSubmitHandler = evt => {
- Функция предназначена для сохранения данных только у формы редактирования профиля и это нужно отразить в названии.
Например, используйте название handleProfileFormSubmit.
  evt.preventDefault();

  profileName.textContent = popupInputTypeName.value;
  profileRegalia.textContent = popupInputTypeRegalia.value;

  togglePopupClass(popupTypeProfileEdit);
}

// ? ДОБАВЛЕНИЕ И ИЗМЕНЕНИЕ КАРТОЧЕК

// * создание карточки
const addCards = (name, link) => {

  // * создаем переменную для темплейта карточки
  const cardTemplate = document.querySelector('#cards-template').content.cloneNode(true);
- Это некорректное клонирование шаблона разметки. Сейчас клонируется сама нода template и это может привести к ошибкам.
Нужно после свойства content вызвать querySelector, найти конечный элемент (обычно это div) и клонировать его
Подробнее в https://developer.mozilla.org/ru/docs/Web/HTML/Element/template , раздел "Ловушка DocumentFragment"
  // * создаем переменную для лайка внутри карточки
  const like = cardTemplate.querySelector('.card__like-button');
  // * создаем переменную для иконки корзины внутри карточки
  const bin = cardTemplate.querySelector('.card__delete-card');

  // * текстовое содержимое заголовка карточки равно значению параметра name переменной card
  cardTemplate.querySelector('.card__title').textContent = name;
  // * ссылка на иллюстрацию в карточке содержится в параметре link переменной card
  cardTemplate.querySelector('.card__img').src = link;

  // * объявляем функцию, где прописан механизм лайка
  const addLike = evt => {
    // класс подставляется и убирается по клику (event) на объект (evt.target)
    evt.target.classList.toggle('card__like-button_active');
  }

  // * объявляем функцию, где прописан механизм удаления карточки
  const deleteCard = evt => {
    evt.target.closest('.card').remove();
  }

  // * вешаем обработчик на картинку в массиве, по клику на картинку открывается большое фото
  cardTemplate.querySelector('.card__img').addEventListener('click', () => {

    photoPopup.querySelector('.photo-popup__image').src = link;
    photoPopup.querySelector('.photo-popup__caption').textContent = name;

    togglePopupClass(photoPopup);
  });

  // * вешаем обработчик на иконку корзины
  bin.addEventListener('click', deleteCard);

  // * вешаем обработчик на кнопку. ВАЖНО: это происходит внутри функции создания карточек из массива
  like.addEventListener('click', addLike);

  // * вставляем получившуюся конструкцию в конец секции, записанной в переменную cardsSection
  return cardTemplate;
}

// * рендеринг карточки
const renderCard = (name, link) => {
  cardsSection.prepend(addCards(name, link));
}

// ! ОТКРЫТИЕ И ЗАКРЫТИЕ ПОПАПОВ ПО КЛИКУ НА ESC
const closePopupOnEscPress = () => {
- Название функции не соответвует внутреннему коду: код не выполняет закрытие popup при нажатии esc
Например, можно использовать название addPopupEventListeners

  const popupList = Array.from(document.querySelectorAll('.the-popup'));

  popupList.forEach(popup => {
    document.addEventListener('keydown', evt => {
- Неверно добавляется обработчик для Escape, по чеклисту нужно "Слушатель событий, закрывающий модальное окно по нажатию на Esc , добавляется при открытии модального окна и удаляется при его закрытии"
      if (popup.classList.contains('popup_opened') && evt.key === 'Escape') {
        togglePopupClass(popup);
      }
    })
  })
}

closePopupOnEscPress();


// ! ОБРАБОТЧИКИ

// ? ОБРАБОТЧИКИ ИЗМЕНЕНИЯ ПРОФИЛЯ И ПЕРВОГО ПОПАПА

// * вешаем обработчики на кнопку edit в блоке profile и кнопку закрытия открытого попапа

if (popupTypeProfileEdit.classList.contains('popup_opened') === false) {
  popupInputTypeName.value = profileName.textContent;
- Надо исправить: по заданию нужно переписать значения в элементы редактирования только при показе popup
На открытии страницы переписывать значения не требуется
  popupInputTypeRegalia.value = profileRegalia.textContent;
- Надо исправить: по заданию нужно переписать значения в элементы редактирования только при показе popup
}
profileEditButton.addEventListener('click', () => {
- Надо исправить: по заданию нужно переписать значения в элементы редактирования при показе popup
В работе нет кода, который это делает
- Надо исправить: при показе popup нужно безусловно удалить тексты ошибок и настроить состояние кнопки submit по требованиям задания
  togglePopupClass(popupTypeProfileEdit);
});
popupCloseButton.addEventListener('click', () => togglePopupClass(popupTypeProfileEdit));

// * вешаем обработчик событий на фон первого попапа. по клику на фон попап закрывается.
/*Не надо попапы (и вообще какие-либо DOM-элементы) называть по номерам даже в коментариях, в 9-м задании у Вас появится ещё два попапа, и тот,
который сейчас первый, может стать совсем не первым в размётке! */
popupTypeProfileEdit.addEventListener('click', closePopupOnClick);

// * вешаем обработчик на форму первого попапа - попап по клику на кнопку "сохранить" закрывается
popupFormTypeUserInfo.addEventListener('submit', formSubmitHandler);

// ? ОБРАБОТЧИКИ ДОБАВЛЕНИЯ КАРТОЧКИ И ВТОРОГО ПОПАПА

// * вешаем обработчик на кнопку с плюсиком в блоке profile. по клику на кнопку открывается второй попап
profileAddButton.addEventListener('click', () => togglePopupClass(popupTypeAddNewCard));
- Надо исправить: при показе popup нужно безусловно удалить тексты ошибок и настроить состояние кнопки submit по требованиям задания

// * вешаем обработчик на крестик во втором попапе
anotherCloseButton.addEventListener('click', () => togglePopupClass(popupTypeAddNewCard));
// * вешаем обработчик на второй попап - по клику на фон попап закрывается
popupTypeAddNewCard.addEventListener('click', closePopupOnClick);

// * вешаем обработчик на форму второго попапа. по клику на кнопку "сохранить" добавляется новая карточка
popupFormTypeAddCard.addEventListener('submit', evt => {
  evt.preventDefault();

  cardImg = document.querySelector('.popup__input_type_card-link').value;
- Надо исправить: Если переменная не перезаписывается (ей не присваивается новое значение в коде проекта), она должна быть объявлена как `const`.
- Надо исправить: Выполнен повторный поиск элемента, используйте переменную inputCardTitle
  cardTitle = document.querySelector('.popup__input_type_card-title').value;
- Надо исправить: Выполнен повторный поиск элемента
- Надо исправить: Если переменная не перезаписывается, она должна быть объявлена как `const`.

  renderCard(cardTitle, cardImg);

  togglePopupClass(popupTypeAddNewCard);
});

// * вешаем обработчик на кнопку закрытия большого попапа
photoPopup.querySelector('.photo-popup__close-button').addEventListener('click', () => togglePopupClass(photoPopup));

// * вешаем обработчик на фон попапа с большим фото. по клику на фон попап закрывается
photoPopup.addEventListener('click', closePopupOnClick);


// ! МАССИВ КАРТОЧЕК

const initialCards = [
  {
      name: 'Архыз',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
  },
  {
      name: 'Челябинская область',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
  },
  {
      name: 'Иваново',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
  },
  {
      name: 'Камчатка',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
  },
  {
      name: 'Холмогорский район',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
  },
  {
      name: 'Байкал',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
  }
];

initialCards.forEach(card => {
  renderCard(card.name, card.link);
- Надо исправить: renderCard добавляет новую карточку в начало и порядок элементов на странице не совпадает с порядком элементов в массиве. Добавление в начало требуется только для новой карточки.
  Нужно использовать разные методы добавления: append для первого добавления и prepend для новых карточек.
});
