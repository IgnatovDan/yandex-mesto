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

// review: использован document для поиска элемента и могут быть найдены неверные DOM элементы
//    потому что возможно использование этого же класса на других элементах страницы
//    Для поиска элементов блока нужно использовать корневой DOM элемент соответствующего блока popup
// review: объявлена глобальная переменная popupImageElement для обращения к DOM элементу.
//    Этот элемент является внутренней деталью реализации блока popup_type_image
//    и не должен быть доступен внешнему коду.
export const popupImageElement = document.querySelector('.popup__image');
// review: использован document для поиска элемента и могут быть найдены неверные DOM элементы
//    потому что возможно использование этого же класса на других элементах страницы
//    Для поиска элементов блока нужно использовать корневой DOM элемент соответствующего блока popup
export const popupImageElementCaption = document.querySelector('.popup__caption');
