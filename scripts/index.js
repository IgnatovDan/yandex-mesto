const BEM_FORM__INPUT_INITIAL_STATE = 'form__input_initial-state';
const BEM_FORM__INPUT_VALIDATION_MESSAGE = 'form__input-validation-message';

function createPopup(popupEl) {
  const BEM_POPUP_OPENED = 'popup_opened';
  const result = {};
  result.popupEl = popupEl;
  result.popupCloseEl = result.popupEl.querySelector('.popup__close');

  result.hide = () => {
    result.popupEl.classList.remove(BEM_POPUP_OPENED);
  };
  result.show = () => {
    result.popupEl.classList.add(BEM_POPUP_OPENED);
  };
  result.popupCloseEl.addEventListener('click', (evt) => {
    // clear form/elements values ???
    // result.closingEvent?.();
    result.hide(popupEl);
  });

  return result;
}

function initializePopups() {
  const BEM_POPUP = 'popup';

  function removePopupPageIsLoadingState() {
      // use querySelectorAll because long list of event handlers works slow
      for (let popup of document.querySelectorAll(`.${BEM_POPUP}`)) {
      popup.classList.remove('popup_page-is-loading');
    }
    document.removeEventListener('DOMContentLoaded', removePopupPageIsLoadingState);
  }

  if (document.readyState == 'loading') {
    // https://learn.javascript.ru/onload-ondomcontentloaded#readystate
    document.addEventListener('DOMContentLoaded', removePopupPageIsLoadingState);
  } else {
    removePopupPageIsLoadingState();
  }
}

function createProfileSection(sectionEl) {
  const result = {};
  result.nameEl = sectionEl.querySelector('.profile__name');
  result.detailsEl = sectionEl.querySelector('.profile__details');

  result.editEl = sectionEl.querySelector('.profile__edit');
  result.editEl.addEventListener('click', () => {
    result.onEditProfile?.({
      name: result.nameEl.textContent,
      details: result.detailsEl.textContent,
    });
  });

  result.addPlaceEl = sectionEl.querySelector('.profile__add');
  result.addPlaceEl.addEventListener('click', () => {
    result.onAddPlace?.();
  });

  result.updateProfileElements = ({ name, details }) => {
    result.nameEl.textContent = name;
    result.detailsEl.textContent = details;
  };

  return result;
}

function createEditProfilePopup(popupEl) {
  const result = {};

  result.popupEl = popupEl;
  result.popup = createPopup(popupEl);

  result.formEl = result.popupEl.querySelector('.profile-form');
  result.formEl.addEventListener('submit', (evt) => {
    evt.preventDefault();
    result.onSubmit?.({
      name: result.nameInput.value,
      details: result.detailsInput.value,
    });
    result.popup.hide();
  });

  result.nameInput = result.formEl.querySelector('.profile-form__input_name');
  result.detailsInput = result.formEl.querySelector('.profile-form__input_details');

  result.show = ({ name, details }) => {
    result.nameInput.value = name;
    result.detailsInput.value = details;
    result.popup.show();
  }

  return result;
}

function createAddPlacePopup(popupEl) {
  const result = {};
  result.popupEl = popupEl;
  result.popup = createPopup(popupEl);

  result.formEl = result.popupEl.querySelector('.add-place-form');
  result.formEl.addEventListener('submit', (evt) => {
    evt.preventDefault();
    result.onSubmit?.({
      name: result.nameInput.value,
      link: result.linkInput.value,
    });
    result.popup.hide();
  });

  result.nameInput = result.formEl.querySelector('.add-place-form__input_name');
  result.linkInput = result.formEl.querySelector('.add-place-form__input_link');

  result.show = () => {
    result.formEl.querySelectorAll('.form__input').forEach((inputEl) => {
      inputEl.value = '';
      inputEl.classList.add(BEM_FORM__INPUT_INITIAL_STATE);
    });
  
    result.formEl.querySelectorAll(`.${BEM_FORM__INPUT_VALIDATION_MESSAGE}`).forEach((messageEl) => {
      messageEl.content = '';
    });
  
    result.popup.show();
  }
  
  return result;
}

function createViewPlacePopup(popupEl) {
  const result = {};
  result.popupEl = popupEl;
  result.popup = createPopup(popupEl);
  result.viewPlaceEl = result.popupEl.querySelector('.view-place');
  result.imageEl = result.viewPlaceEl.querySelector('.view-place__image');
  result.captionEl = result.viewPlaceEl.querySelector('.view-place__caption');

  result.show = ({ caption, link }) => {
    result.imageEl.src = link;
    result.captionEl.textContent = caption;
    result.popup.show();
  };

  return result;
}

function createPlace(placeEl) {
  const result = {};
  result.placeEl = placeEl;
  result.imageEl = result.placeEl.querySelector('.place__image');
  result.captionEl = result.placeEl.querySelector('.place__caption');
  result.likeEl = result.placeEl.querySelector('.place__like');
  result.deleteEl = result.placeEl.querySelector('.place__delete');

  result.imageEl.addEventListener('click', () => result.onImageClick?.());
  result.likeEl.addEventListener('click', () => result.onLikePlace?.());
  result.deleteEl.addEventListener('click', () => result.onDeletePlace?.());  

  result.bind = ({ name, link }) => {
    result.imageEl.src = link;
    result.captionEl.textContent = name;
  };
  result.toggleLike = () => {
    result.likeEl.classList.toggle('place__like_active');
  };

  return result;
}

const editProfilePopup = createEditProfilePopup(document.querySelector('.popup_type_edit-profile'));
const profileSection = createProfileSection(document.querySelector('.profile'));
const addPlacePopup = createAddPlacePopup(document.querySelector('.popup_type_add-place'));
const viewPlacePopup = createViewPlacePopup(document.querySelector('.popup_type_view-place'));

profileSection.onEditProfile = ({ name, details }) => {
  editProfilePopup.show({ name, details });
}
profileSection.onAddPlace = () => {
  addPlacePopup.show();
}

editProfilePopup.onSubmit = ({ name, details }) => {
  profileSection.updateProfileElements({ name, details });
};

addPlacePopup.onSubmit = ({ name, link }) => {
  const placesListItem = createPlacesListItemFromTemplateEl({ name, link });
  placesListEl.prepend(placesListItem.placesListItemEl);
}

const placesListItemTemplate = document.querySelector('#places-list-item-template').content.querySelector('.places-list__item');
const placeTemplate = document.querySelector('#place-template').content.querySelector('.place');
const placesListEl = document.querySelector('.places-list');

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

function createPlacesListItemFromTemplateEl(card) {
  const result = {};
  const placesListItemEl = placesListItemTemplate.cloneNode(true);
  result.placesListItemEl = placesListItemEl;

  const placeEl = placeTemplate.cloneNode(true);
  placesListItemEl.append(placeEl);

  const place = createPlace(placeEl);
  place.onLikePlace = () => place.toggleLike();
  place.onDeletePlace = () => placesListItemEl.remove();
  place.onImageClick = () => {
    viewPlacePopup.show({ // TODO: remove reference to global variable
      caption: place.captionEl.textContent,
      link: place.imageEl.src,
    });
  }
  place.bind(card);

  return result;
}

function renderPlacesList(cards) {
  cards.forEach(card => {
    const placesListItem = createPlacesListItemFromTemplateEl(card);
    placesListEl.append(placesListItem.placesListItemEl);
  });
}

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
initializePopups();
