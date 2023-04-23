export const defaultFormConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup_input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};

export const popupConfig = {
    editFormModalWindow: 'popup_type_edit',
    cardFormModalWindow: 'popup_type_new-card',
    imageModalWindow: 'popup_type_image',
    removeCardModalWindow: 'popup_type_remove-card',
    changeAvatarModalWindow: 'popup__edit-avatar'
};

export const cardsConfig = {
    placesWrap: 'places__list',
};

export const popupImageElement = document.querySelector('.popup__image');
export const popupImageElementCaption = document.querySelector('.popup__caption');
