const validationOptions = {
  submitButtonClass: 'form__save',
  submitButtonDisabledClass: 'form__save_disabled',
  inputWithMessageClass: 'form__input-with-message',
  inputMessageClass: 'form__input-message',
  inputInvalidClass: 'form__input_invalid',
};

function createPopup(popupEl) {
  const BEM_POPUP_OPENED = 'popup_opened';

  const result = { popupEl };

  result.popupCloseEl = result.popupEl.querySelector('.popup__close');

  result.hide = () => {
    result.onHiding?.();
    document.removeEventListener('keydown', result.keydownEscapeHandler);
    result.popupEl.classList.remove(BEM_POPUP_OPENED);
  };

  result.show = () => {
    result.popupEl.classList.add(BEM_POPUP_OPENED);
    document.addEventListener('keydown', result.keydownEscapeHandler);
  };

  result.popupCloseEl.addEventListener('click', (evt) => {
    result.hide(popupEl);
  });

  result.popupEl.addEventListener('click', (evt) => {
    if (evt.target === result.popupEl) {
      result.hide();
    }
  });

  result.keydownEscapeHandler = (evt) => {
    if (evt.key.toLowerCase() === 'escape') {
      result.hide();
    }
  };

  function removePopupPageIsLoadingState() {
    // Initially hide popup to avoid flicks on page loading when CSS files are not yet loaded
    result.popupEl.classList.remove('popup_page-is-loading');
    document.removeEventListener('DOMContentLoaded', removePopupPageIsLoadingState);
  }

  if (document.readyState == 'loading') {
    // https://learn.javascript.ru/onload-ondomcontentloaded#readystate
    document.addEventListener('DOMContentLoaded', removePopupPageIsLoadingState);
  } else {
    removePopupPageIsLoadingState();
  }

  return result;
}

function createProfileSection(sectionEl) {
  const result = { sectionEl };

  result.nameEl = sectionEl.querySelector('.profile__name');
  result.detailsEl = sectionEl.querySelector('.profile__details');
  result.editEl = sectionEl.querySelector('.profile__edit');
  result.addPlaceEl = sectionEl.querySelector('.profile__add');

  result.editEl.addEventListener('click', () => {
    result.onEditProfile?.({
      values: {
        name: result.nameEl.textContent,
        details: result.detailsEl.textContent,
      }
    });
  });

  result.addPlaceEl.addEventListener('click', () => {
    result.onAddPlace?.();
  });

  result.updateProfileValues = ({ name, details }) => {
    result.nameEl.textContent = name;
    result.detailsEl.textContent = details;
  };

  return result;
}

function createPopupWithForm(popupEl, { validationOptions }) {
  const result = { popupEl };

  result.formEl = result.popupEl.querySelector('.form');

  result.popup = createPopup(popupEl);
  if (validationOptions) {
    result.formValidation = createFormValidation({ ...validationOptions, formEl: result.formEl });
  }

  result.formEl.addEventListener('submit', (evt) => {
    evt.preventDefault();
    result.onSubmit?.();
    result.popup.hide();
    // clear input values after data entering is finished
    // entered values should not be shown when form is shown next time
    result.formEl.reset(); // ??? why shouldn't reset form ???
  });

  result.show = () => {
    // Figma project requires empty validation messages when popup is opened.
    // And, the 'submit' button should be disabled when form is opened.
    result.formValidation?.resetValidationState();
    result.popup.show();
  }

  result.popup.onHiding = () => {
    result.formValidation?.resetValidationState();
    // clear input values after data entering is finished
    // entered values should not be shown when form is shown next time
    result.formEl.reset(); // ??? why shouldn't reset form ???
  }

  return result;
}

function createEditProfilePopup(popupEl, options) {
  const result = { popupEl };

  result.popupWithForm = createPopupWithForm(popupEl, options);
  result.nameInput = result.popupWithForm.formEl.querySelector('.form__input_type_name');
  result.detailsInput = result.popupWithForm.formEl.querySelector('.form__input_type_details');

  result.popupWithForm.onSubmit = () => {
    result.onSubmit?.({
      values: {
        name: result.nameInput.value,
        details: result.detailsInput.value,
      }
    });
  };

  result.show = ({ name, details }) => {
    result.nameInput.value = name;
    result.detailsInput.value = details;
    result.popupWithForm.show();
    result.nameInput.focus();
  }

  return result;
}

function createAddPlacePopup(popupEl, options) {
  const result = { popupEl };

  result.popupWithForm = createPopupWithForm(popupEl, options);
  result.nameInput = result.popupWithForm.formEl.querySelector('.form__input_type_name');
  result.linkInput = result.popupWithForm.formEl.querySelector('.form__input_type_link');

  result.popupWithForm.onSubmit = () => {
    result.onSubmit?.({
      values: {
        name: result.nameInput.value,
        link: result.linkInput.value,
      }
    });
  };

  result.show = () => {
    result.nameInput.value = '';
    result.linkInput.value = '';
    result.popupWithForm.show();
    result.nameInput.focus();
  }

  return result;
}

function createViewPlacePopup(popupEl) {
  const result = { popupEl };

  result.viewPlaceEl = result.popupEl.querySelector('.view-place');
  result.imageEl = result.viewPlaceEl.querySelector('.view-place__image');
  result.captionEl = result.viewPlaceEl.querySelector('.view-place__caption');

  result.popup = createPopup(popupEl);

  result.show = ({ caption, link }) => {
    result.imageEl.src = link;
    result.imageEl.alt = caption;
    result.captionEl.textContent = caption;
    result.popup.show();
  };

  result.popup.onHiding = () => {
    // Clear src to avoid previous image flick when popup is being shown: old image is painted for a short time
    result.imageEl.src = '';
    // Clear caption in addition (for security reason?)
    result.captionEl.textContent = '';
  }

  return result;
}

function createPlace(placeEl) {
  const result = { placeEl };

  result.imageEl = result.placeEl.querySelector('.place__image');
  result.captionEl = result.placeEl.querySelector('.place__caption');
  result.likeEl = result.placeEl.querySelector('.place__like');
  result.deleteEl = result.placeEl.querySelector('.place__delete');

  result.imageEl.addEventListener('click', () => result.onImageClick?.({ values: result.getPlaceValues() }));
  result.likeEl.addEventListener('click', () => result.onLikeClick?.({ place: result, values: result.getPlaceValues() }));
  result.deleteEl.addEventListener('click', () => result.onDeleteClick?.());

  result.updatePlaceValues = ({ name, link, like }) => {
    result.imageEl.src = link;
    result.imageEl.alt = name;
    result.captionEl.textContent = name;
    result.likeEl.classList.toggle('place__like_active', !!like);
  };

  result.getPlaceValues = () => {
    return {
      name: result.captionEl.textContent,
      link: result.imageEl.src,
      like: result.likeEl.classList.contains('place__like_active')
    };
  };

  return result;
}

function createPlacesListItem(placesListItemEl, { placeTemplate }) {
  const result = {};
  result.placesListItemEl = placesListItemEl;

  const placeEl = placeTemplate.cloneNode(true);
  result.place = createPlace(placeEl);

  result.place.onLikeClick = (evt) => result.onPlaceLikeClick?.(evt);
  result.place.onDeleteClick = () => result.onPlaceDeleteClick?.();
  result.place.onImageClick = (evt) => result.onPlaceImageClick?.({ values: { ...evt.values } });

  result.updatePlaceValues = ({ name, link, like }) => result.place.updatePlaceValues({ name, link, like });

  result.placesListItemEl.append(result.place.placeEl);

  return result;
}

function createPlacesList(placesListEl, { placesListItemTemplate, placeTemplate }) {
  const result = { placesListEl, placesListItemTemplate, placeTemplate };

  result.renderNewPlaceItem = ({ name, link }, { usePrepend } = {}) => {
    const placesListItemEl = result.placesListItemTemplate.cloneNode(true);

    const placesListItem = createPlacesListItem(placesListItemEl, { placeTemplate: result.placeTemplate });

    placesListItem.onPlaceDeleteClick = () => placesListItem.placesListItemEl.remove();
    placesListItem.onPlaceImageClick = (evt) => result.onPlaceImageClick?.({ values: { ...evt.values } });
    placesListItem.onPlaceLikeClick = (evt) => placesListItem.updatePlaceValues({ ...evt.values, like: !evt.values.like });

    placesListItem.updatePlaceValues({ name, link });

    result.placesListEl[usePrepend ? 'prepend' : 'append'](placesListItem.placesListItemEl);
  };

  result.renderPlaces = (places) => {
    places.forEach(({ name, link }) => {
      result.renderNewPlaceItem({ name, link });
    });
  };

  result.addPlace = ({ name, link }) => {
    result.renderNewPlaceItem({ name, link }, { usePrepend: true });
  };

  return result;
}

const placesListItemTemplate = document.querySelector('#places-list-item-template').content.querySelector('.places-list__item');
const placeTemplate = document.querySelector('#place-template').content.querySelector('.place');

const editProfilePopup = createEditProfilePopup(document.querySelector('.popup_type_edit-profile'), { validationOptions });
const profileSection = createProfileSection(document.querySelector('.profile'));
const addPlacePopup = createAddPlacePopup(document.querySelector('.popup_type_add-place'), { validationOptions });
const viewPlacePopup = createViewPlacePopup(document.querySelector('.popup_type_view-place'));
const placesList = createPlacesList(document.querySelector('.places-list'), { placesListItemTemplate, placeTemplate });

profileSection.onEditProfile = (evt) => editProfilePopup.show({ ...evt.values });
profileSection.onAddPlace = () => addPlacePopup.show();
editProfilePopup.onSubmit = (evt) => profileSection.updateProfileValues({ ...evt.values });
addPlacePopup.onSubmit = (evt) => placesList.addPlace({ ...evt.values });
placesList.onPlaceImageClick = (evt) => viewPlacePopup.show({ caption: evt.values.name, link: evt.values.link });

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

placesList.renderPlaces(initialCards);
