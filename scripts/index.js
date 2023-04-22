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
const popupInputTypeName = document.querySelector('.popup__input_type_name');
const popupInputTypeRegalia = document.querySelector('.popup__input_type_regalia');
const popupFormTypeUserInfo = document.querySelector('.popup__form_type_user-info');

// * попап добавления новой карточки
const popupTypeAddNewCard = document.querySelector('.popup_type_add-new-card');
const anotherCloseButton = document.querySelector('.another-close-button');
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
}

// * объявляем функцию, которая закрывает попап по клику в любое место на экране, кроме самого попапа (класс эл-та popup__container)
const closePopupOnClick = event => {
  if (event.target !== event.currentTarget) {
    return;
  } togglePopupClass(event.target);
}

// * объявляем функцию, которая передает введенные в формы значения на обработку
const formSubmitHandler = evt => {
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
  const popupList = Array.from(document.querySelectorAll('.the-popup'));

  popupList.forEach(popup => {
    document.addEventListener('keydown', evt => {
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
  popupInputTypeRegalia.value = profileRegalia.textContent;
}
profileEditButton.addEventListener('click', () => {

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
// * вешаем обработчик на крестик во втором попапе
anotherCloseButton.addEventListener('click', () => togglePopupClass(popupTypeAddNewCard));
// * вешаем обработчик на второй попап - по клику на фон попап закрывается
popupTypeAddNewCard.addEventListener('click', closePopupOnClick);

// * вешаем обработчик на форму второго попапа. по клику на кнопку "сохранить" добавляется новая карточка
popupFormTypeAddCard.addEventListener('submit', evt => {
  evt.preventDefault();

  cardImg = document.querySelector('.popup__input_type_card-link').value;
  cardTitle = document.querySelector('.popup__input_type_card-title').value;

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
});
