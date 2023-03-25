const BEM_POPUP = 'popup';
const BEM_POPUP_OPENED = 'popup_opened';
const BEM_PLACE__CAPTION = 'place__caption';
const BEM_FORM__INPUT_INITIAL_STATE = 'form__input_initial-state';
const BEM_FORM__INPUT_VALIDATION_MESSAGE = 'form__input-validation-message';

function createProfileSection() {
  const result = {};
  result.nameEl = document.querySelector('.profile__name');
  result.detailsEl = document.querySelector('.profile__details');

  result.editEl = document.querySelector('.profile__edit');
  result.editEl.addEventListener('click', () => {
    result.editProfileEventHandler?.({
      name: result.nameEl.textContent,
      details: result.detailsEl.textContent,
    });
  });

  result.addPlaceEl = document.querySelector('.profile__add');
  result.addPlaceEl.addEventListener('click', showAddPlaceForm);

  result.updateProfileElements = ({ name, details }) => {
    result.nameEl.textContent = name;
    result.detailsEl.textContent = details;
  };

  return result;
}

function createEditProfilePopup() {
  const result = {};

  result.popupEl = document.querySelector('.popup_type_edit-profile');

  result.formEl = result.popupEl.querySelector('.profile-form');
  result.formEl.addEventListener('submit', (evt) => {
    evt.preventDefault();
    result.submitEventHandler?.({
      name: result.nameInput.value,
      details: result.detailsInput.value,
    });
    hidePopup(result.popupEl);
  });

  result.nameInput = result.formEl.querySelector('.profile-form__input_name');
  result.detailsInput = result.formEl.querySelector('.profile-form__input_details');

  result.showProfileEditForm = ({ name, details }) => {
    result.nameInput.value = name;
    result.detailsInput.value = details;
    showPopup(result.popupEl);
  }

  return result;
}

const editProfilePopup = createEditProfilePopup();
const profileSection = createProfileSection();

profileSection.editProfileEventHandler = ({ name, details }) => {
  editProfilePopup.showProfileEditForm({ name, details });
}

editProfilePopup.submitEventHandler = ({ name, details }) => {
  profileSection.updateProfileElements({ name, details });
};

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

function showAddPlaceForm() {
  popupAddPlaceEl.querySelectorAll('.form__input').forEach((inputEl) => {
    inputEl.value = '';
    inputEl.classList.add(BEM_FORM__INPUT_INITIAL_STATE);
  });

  popupAddPlaceEl.querySelectorAll(`.${BEM_FORM__INPUT_VALIDATION_MESSAGE}`).forEach((messageEl) => {
    messageEl.content = '';
  });

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

function renderPlaceEl({ name, link }) {
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

document.querySelectorAll(`.${BEM_POPUP}`).forEach((popupEl) => {
  popupEl.querySelector('.popup__close').addEventListener('click', (evt) => {
    hidePopup(popupEl);
  });
});

addPlaceFormEl.addEventListener('submit', addPlaceFormSubmitHandler);

document.querySelectorAll('.form__input-group').forEach((inputGroupEl) => {
  const inputInvalidModifier = 'form__input_invalid';

  const validationMessageEl = inputGroupEl.querySelector(`.${BEM_FORM__INPUT_VALIDATION_MESSAGE}`);
  const inputEl = inputGroupEl.querySelector('.form__input');

  // Or, use event bubble: inputGroupEl.addEventListener('input', (evt) => {
  inputEl.addEventListener('input', (evt) => {
    inputEl.classList.remove(BEM_FORM__INPUT_INITIAL_STATE);
    if (evt.target.validity.valid) {
      validationMessageEl.textContent = ''; // empty content sets 0px height and element is not visible
      inputEl.classList.remove(inputInvalidModifier);
    }
    else {
      // there can be smooth show/hide similar to popup show/hide
      validationMessageEl.textContent = evt.target.validationMessage;
      inputEl.classList.add(inputInvalidModifier);
    }
  });
});

renderPlacesList(initialCards);

if (document.readyState == 'loading') {
  // https://learn.javascript.ru/onload-ondomcontentloaded#readystate
  document.addEventListener('DOMContentLoaded', removePopupPageIsLoadingState);
} else {
  removePopupPageIsLoadingState();
}
