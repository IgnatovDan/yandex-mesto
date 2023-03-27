const BEM_FORM__INPUT_WITH_MESSAGE = 'form__input-with-message';
const BEM_FORM__INPUT_MESSAGE = 'form__input-message';
const BEM_FORM__INPUT_INVALID_MODIFIER = 'form__input_invalid';

function createFormValidation({ formEl, submitButtonEl, inputWithMessageClass, inputMessageClass, inputInvalidClass }) {
  const result = {
    formEl, submitButtonEl, inputWithMessageClass, inputMessageClass, inputInvalidClass
  };

  result.inputWithMessageList = Array.from(result.formEl.querySelectorAll(`.${inputWithMessageClass}`)).map(
    (itemEl) => {
      return { inputEl: itemEl.querySelector('input'), messageEl: itemEl.querySelector(`.${inputMessageClass}`) };
    }
  );

  result._refreshFormSubmit = () => {
    // Or: hasInvalidInput = !!formEl.querySelector('input:invalid');
    const hasInvalidInput = !!result.formEl.querySelectorAll(`input:invalid`).length;
    result.submitButtonEl.classList.toggle('form__save_disabled', hasInvalidInput);
    result.submitButtonEl.disabled = hasInvalidInput;
  }

  result._inputHandler = (evt) => {
    result._refreshFormSubmit();
    const messageEl = evt.target.closest(`.${inputWithMessageClass}`).querySelector(`.${inputMessageClass}`);
    if (evt.target.validity.valid) {
      messageEl.textContent = '';
      evt.target.classList.remove(inputInvalidClass);
    }
    else {
      // can be better: implement smooth show/hide similar to popup show/hide
      messageEl.textContent = evt.target.validationMessage;
      evt.target.classList.add(inputInvalidClass);
    }
  };

  result.dispose = () => {
    result.inputWithMessageList?.forEach((item) => {
      item.inputEl.removeEventListener('input', result._inputHandler);
      item.messageEl.textContent = '';
    });
    result.inputWithMessageList = [];
    result.formEl = null;
    result.submitButtonEl = null;
  };

  result._refreshFormSubmit();

  result.inputWithMessageList.forEach((item) => {
    item.messageEl.content = '';
    item.inputEl.classList.remove(inputInvalidClass);

    // Or, use event bubble: inputGroupEl.addEventListener('input', (evt) => {
    // I prefer subscribing to the exactly target element
    // Note: If value is changed from js code then 'input' event doesn't occur
    // and the 'form__input:invalid' is updated for 'valueMissing' and NOT updated for 'tooShort'
    item.inputEl.addEventListener('input', result._inputHandler);
  });

  return result;
}

function createPopup(popupEl) {
  const BEM_POPUP_OPENED = 'popup_opened';

  const result = {};
  result.popupEl = popupEl;
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
  const result = {};
  result.nameEl = sectionEl.querySelector('.profile__name');
  result.detailsEl = sectionEl.querySelector('.profile__details');

  result.editEl = sectionEl.querySelector('.profile__edit');
  result.editEl.addEventListener('click', () => {
    result.onEditProfile?.({
      values: {
        name: result.nameEl.textContent,
        details: result.detailsEl.textContent,
      }
    });
  });

  result.addPlaceEl = sectionEl.querySelector('.profile__add');
  result.addPlaceEl.addEventListener('click', () => {
    result.onAddPlace?.();
  });

  result.renderProfileValues = ({ name, details }) => {
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
  result.submitButtonEl = result.popupEl.querySelector('.form__save');
  result.nameInput = result.formEl.querySelector('.profile-form__input_name');
  result.detailsInput = result.formEl.querySelector('.profile-form__input_details');

  result.formEl.addEventListener('submit', (evt) => {
    evt.preventDefault();
    result.onSubmit?.({
      values: {
        name: result.nameInput.value,
        details: result.detailsInput.value,
      }
    });
    result.popup.hide();
  });

  result.show = ({ name, details }) => {
    result.nameInput.value = name;
    result.detailsInput.value = details;
    result.formValidation = createFormValidation({
      formEl: result.formEl,
      submitButtonEl: result.submitButtonEl,
      inputWithMessageClass: BEM_FORM__INPUT_WITH_MESSAGE,
      inputMessageClass: BEM_FORM__INPUT_MESSAGE,
      inputInvalidClass: BEM_FORM__INPUT_INVALID_MODIFIER,
    });
    result.popup.show();
  }

  result.popup.onHiding = () => {
    result.formValidation.dispose();
    result.formValidation = null;
    result.formEl.reset();
  }

  return result;
}

function createAddPlacePopup(popupEl) {
  const result = {};
  result.popupEl = popupEl;
  result.popup = createPopup(popupEl);

  result.formEl = result.popupEl.querySelector('.add-place-form');
  result.submitButtonEl = result.popupEl.querySelector('.form__save');
  result.nameInput = result.formEl.querySelector('.add-place-form__input_name');
  result.linkInput = result.formEl.querySelector('.add-place-form__input_link');

  result.formEl.addEventListener('submit', (evt) => {
    evt.preventDefault();
    result.onSubmit?.({
      values: {
        name: result.nameInput.value,
        link: result.linkInput.value,
      }
    });
    result.popup.hide();
  });

  result.show = () => {
    // Figma project requires hidden validation messages when form is opened.
    // Submit button should be disabled when form is opened.
    result.nameInput.value = '';
    result.linkInput.value = '';
    result.formValidation = createFormValidation({
      formEl: result.formEl,
      submitButtonEl: result.submitButtonEl,
      inputWithMessageClass: BEM_FORM__INPUT_WITH_MESSAGE,
      inputMessageClass: BEM_FORM__INPUT_MESSAGE,
      inputInvalidClass: BEM_FORM__INPUT_INVALID_MODIFIER,
    });

    result.popup.show();
  }

  result.popup.onHiding = () => {
    result.formValidation.dispose();
    result.formValidation = null;
    result.formEl.reset();
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

  result.popup.onHiding = () => {
    // Clear src to avoid previous image flick when popup is being shown: old image is painted for a short time
    result.imageEl.src = '';
    // Clear caption in addition (for security reason?)
    result.captionEl.textContent = '';
  }

  return result;
}

function createPlace(placeEl) {
  const result = {};
  result.placeEl = placeEl;
  result.imageEl = result.placeEl.querySelector('.place__image');
  result.captionEl = result.placeEl.querySelector('.place__caption');
  result.likeEl = result.placeEl.querySelector('.place__like');
  result.deleteEl = result.placeEl.querySelector('.place__delete');

  result.imageEl.addEventListener('click', () => result.onShowDetails?.({ values: result.getPlaceValues() }));
  result.likeEl.addEventListener('click', () => result.onLikePlace?.({ values: result.getPlaceValues() }));
  result.deleteEl.addEventListener('click', () => result.onDeletePlace?.());

  result.renderPlaceValues = ({ name, link, like }) => {
    result.imageEl.src = link;
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

function createPlacesList(placesListEl, { placesListItemTemplate, placeTemplate }) {
  const result = {};
  result.placesListEl = placesListEl;

  result.createPlacesListItemFromTemplateEl = ({ name, link }) => {
    const result = {};
    const placesListItemEl = placesListItemTemplate.cloneNode(true);
    result.placesListItemEl = placesListItemEl;

    const placeEl = placeTemplate.cloneNode(true);
    placesListItemEl.append(placeEl);

    const place = createPlace(placeEl);
    place.onLikePlace = (evt) => evt.place.renderPlaceValues({ ...evt.values, like: !evt.values.like });
    place.onDeletePlace = () => placesListItemEl.remove();
    place.onShowDetails = (evt) => result.onShowPlaceDetails?.({ values: { ...evt.values } });
    place.renderPlaceValues({ name, link });

    return result;
  };

  result.createItemFromTemplate = ({ name, link }) => {
    const placesListItem = result.createPlacesListItemFromTemplateEl({ name, link });
    placesListItem.onShowPlaceDetails = (evt) => result.onShowPlaceDetails?.({ values: { ...evt.values } });
    return placesListItem;
  };

  result.showPlaces = (places) => {
    places.forEach(({ name, link }) => {
      const placesListItem = result.createItemFromTemplate({ name, link });
      result.placesListEl.append(placesListItem.placesListItemEl);
    });
  };

  result.addPlace = ({ name, link }) => {
    const placesListItem = result.createItemFromTemplate({ name, link });
    result.placesListEl.prepend(placesListItem.placesListItemEl);
  };

  return result;
}

const placesListItemTemplate = document.querySelector('#places-list-item-template').content.querySelector('.places-list__item');
const placeTemplate = document.querySelector('#place-template').content.querySelector('.place');

const editProfilePopup = createEditProfilePopup(document.querySelector('.popup_type_edit-profile'));
const profileSection = createProfileSection(document.querySelector('.profile'));
const addPlacePopup = createAddPlacePopup(document.querySelector('.popup_type_add-place'));
const viewPlacePopup = createViewPlacePopup(document.querySelector('.popup_type_view-place'));
const placesList = createPlacesList(document.querySelector('.places-list'), { placesListItemTemplate, placeTemplate });

profileSection.onEditProfile = (evt) => {
  editProfilePopup.show({ ...evt.values });
}

profileSection.onAddPlace = () => {
  addPlacePopup.show();
}

editProfilePopup.onSubmit = (evt) => {
  profileSection.renderProfileValues({ ...evt.values });
};

addPlacePopup.onSubmit = (evt) => {
  placesList.addPlace({ ...evt.values });
}

placesList.onShowPlaceDetails = (evt) => viewPlacePopup.show({ caption: evt.values.name, link: evt.values.link });

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

placesList.showPlaces(initialCards);
