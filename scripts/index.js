const BEM_POPUP = 'popup';
const BEM_POPUP_OPENED = 'popup_opened';
const BEM_PLACE__CAPTION = 'place__caption';

let profileNameEl = document.querySelector('.profile__name');
let profileDetailsEl = document.querySelector('.profile__details');
let profileEditEl = document.querySelector('.profile__edit');
let profileAddPlaceEl = document.querySelector('.profile__add');

let popupCloseElements = document.querySelectorAll('.popup__close');

let popupEditProfileEl = document.querySelector('.popup_type_edit-profile');
let profileFormEl = popupEditProfileEl.querySelector('.profile-form');
let profileFormNameInput = profileFormEl.querySelector('.profile-form__input_name');
let profileFormDetailsInput = profileFormEl.querySelector('.profile-form__input_details');

let popupAddPlaceEl = document.querySelector('.popup_type_add-place');
let addPlaceFormEl = popupAddPlaceEl.querySelector('.add-place-form');
let addPlaceFormNameInput = addPlaceFormEl.querySelector('.add-place-form__input_name');
let addPlaceFormLinkInput = addPlaceFormEl.querySelector('.add-place-form__input_link');

let popupViewPlaceEl = document.querySelector('.popup_type_view-place');
let viewPlaceEl = popupViewPlaceEl.querySelector('.view-place');
let viewPlaceImageEl = viewPlaceEl.querySelector('.view-place__image');
let viewPlaceCaptionEl = viewPlaceEl.querySelector('.view-place__caption');

let placeTemplate = document.querySelector('#places-list-item-template').content;
let placesListEl = document.querySelector('.places-list');

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

function hidePopup(popupEl) {
  popupEl.classList.remove(BEM_POPUP_OPENED);
}

function showPopup(popupEl) {
  popupEl.classList.add(BEM_POPUP_OPENED);
}

function showProfileEditForm() {
  profileFormNameInput.value = profileNameEl.textContent;
  profileFormDetailsInput.value = profileDetailsEl.textContent;
  showPopup(popupEditProfileEl);
}

function profileEditFormSubmitHandler(evt) {
  evt.preventDefault();
  profileNameEl.textContent = profileFormNameInput.value;
  profileDetailsEl.textContent = profileFormDetailsInput.value;
  hidePopup(evt.target.closest(`.${BEM_POPUP}`));
}

function showAddPlaceForm() {
  showPopup(popupAddPlaceEl);
}

function addPlaceFormSubmitHandler(evt) {
  evt.preventDefault();
  placesListEl.prepend(renderPlaceEl({
    name: addPlaceFormNameInput.value,
    link: addPlaceFormLinkInput.value,
  }));
  hidePopup(evt.target.closest(`.${BEM_POPUP}`));
}

function likePlaceClickHandler(evt) {
  evt.target.classList.toggle('place__like_active');
}

function deletePlaceClickHandler(evt) {
  evt.target.closest('.places-list__item').remove();
}

function imageClickHandler(evt) {
  viewPlaceImageEl.src = evt.target.src;
  const placeCaptionEl = evt.target.closest('.place').querySelector(`.${BEM_PLACE__CAPTION}`);
  viewPlaceCaptionEl.textContent = placeCaptionEl.textContent;
  showPopup(popupViewPlaceEl);
}

function renderPlaceEl({ name, link }) {
  const placeEl = placeTemplate.cloneNode(true);
  const imageEl = placeEl.querySelector('.place__image');
  imageEl.src = link;
  imageEl.addEventListener('click', imageClickHandler);
  placeEl.querySelector(`.${BEM_PLACE__CAPTION}`).textContent = name;
  placeEl.querySelector('.place__like').addEventListener('click', likePlaceClickHandler);
  placeEl.querySelector('.place__delete').addEventListener('click', deletePlaceClickHandler);  
  return placeEl;
}

function renderPlacesList(cards) {
  cards.forEach(card => placesListEl.append(renderPlaceEl(card)));
}

function removePopupPageIsLoadingState() {
  for (let popup of document.querySelectorAll(`.${BEM_POPUP}`)) {
    popup.classList.remove('popup_page-is-loading');
  }
}

for (let element of popupCloseElements) {
  element.addEventListener('click', (evt) => hidePopup(evt.target.closest(`.${BEM_POPUP}`)));
}

profileFormEl.addEventListener('submit', profileEditFormSubmitHandler);
addPlaceFormEl.addEventListener('submit', addPlaceFormSubmitHandler);

profileEditEl.addEventListener('click', showProfileEditForm);
profileAddPlaceEl.addEventListener('click', showAddPlaceForm);

renderPlacesList(initialCards);

if (document.readyState == 'loading') {
  // https://learn.javascript.ru/onload-ondomcontentloaded#readystate
  document.addEventListener('DOMContentLoaded', removePopupPageIsLoadingState);
} else {
  removePopupPageIsLoadingState();
}
