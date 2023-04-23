import './index.css';
import './images/avatar.jpg';

import Card from './components/card.js';
import Section from './components/section.js';
import PopupWithImage from './components/popup-with-image.js';
import PopupWithForm from './components/popup-with-form.js';
import PopupWithFormSubmit from './components/popup-with-form-submit.js';
import UserInfo from './components/user-info.js';
import Api from './components/api.js'
import { popupConfig, cardsConfig } from './utils/constants.js';
import { renderLoading } from "./utils/utils.js";

const openEditFormButton = document.querySelector('.profile__edit-button');
const openCardFormButton = document.querySelector('.profile__add-button');
const openAvatarFormButton = document.querySelector('.profile__image');
const titleInputValue = document.querySelector('.popup_input_type_name');
const descriptionInputValue = document.querySelector('.popup_input_type_description');

const editFormSaveButton = document.querySelector(".popup_type_edit button[type='submit']");
const cardFormSaveButton = document.querySelector(".popup_type_new-card button[type='submit']");

let api = new Api({
  address: 'https://mesto.nomoreparties.co/v1',
  groupId: `cohort-23`,
  token: `eee2ea0d-1fd3-481c-aa66-4794a11da97e`,
});

let userId = null;



let cardInfoSubmit = new PopupWithFormSubmit(popupConfig.removeCardModalWindow);
cardInfoSubmit.setEventListeners();

const cardList = new Section({
    renderer: (cardData) => {
      const card = new Card({
        data: { ...cardData, currentUserId: userId },
        handleCardClick: () => {
          let imagePopup = new PopupWithImage(popupConfig.imageModalWindow);
          imagePopup.setEventListeners();
          imagePopup.open(cardData);
        },
        handleLikeClick: (card) => {
          api.changeLikeCardStatus(card.id(), !card.isLiked())
            .then(data => {
              card.setLikesInfo({ ...data });
              card.getElement().querySelector('.card__like-count').textContent = data.likes.length;

              if (card.isLiked()) card.getElement().querySelector('.card__like-button')
                .classList.add('card__like-button_is-active');
              else card.getElement().querySelector('.card__like-button')
                .classList.remove('card__like-button_is-active');
            })
            .catch(err => console.log(`Ошибка изменения статуса лайка: ${err}`))
        },
        handleDeleteIconClick: (card) => {
          cardInfoSubmit.open();
          cardInfoSubmit.setSubmitAction(() => {
            api.removeCard(card.id());
            card.getElement().remove();
            cardInfoSubmit.close();
          });
        },
      });

      cardList.addItem(card.getView());
    }
  }
);

const newCardPopup = new PopupWithForm({
  popupSelector: popupConfig.cardFormModalWindow,
  handleFormSubmit: (data) => {
    renderLoading(cardFormSaveButton, true);
    api.addCard(data)
      .then((cardData) => {
        const card = new Card({
          data: { ...cardData, currentUserId: userId },
          handleCardClick: () => {
            let imagePopup = new PopupWithImage(popupConfig.imageModalWindow);
            imagePopup.setEventListeners();
            imagePopup.open(cardData);
          },
          handleLikeClick: (card) => {
            api.changeLikeCardStatus(card.id(), !card.isLiked())
              .then(data => {
                card.setLikesInfo({ ...data });
                card.getElement().querySelector('.card__like-count').textContent = data.likes.length;

                if (card.isLiked()) card.getElement().querySelector('.card__like-button')
                  .classList.add('card__like-button_is-active');
                else card.getElement().querySelector('.card__like-button')
                  .classList.remove('card__like-button_is-active');
              })
              .catch(err => console.log(`Ошибка изменения статуса лайка: ${err}`))
          },
          handleDeleteIconClick: (card) => {
            cardInfoSubmit.open();
            cardInfoSubmit.setSubmitAction(() => {
              api.removeCard(card.id());
              card.getElement().remove();
              cardInfoSubmit.close();
            });
          },
        });

        document.querySelector(`.${cardsConfig.placesWrap}`).append(card.getView());
      })
      .catch(err => console.log(`Ошибка добавления карточки: ${err}`))
      .finally(() => {
        renderLoading(cardFormSaveButton);
      });
  },
  popupConfig: popupConfig.cardFormModalWindow
});
newCardPopup.setEventListeners();

const userInfoPopup = new PopupWithForm({
  popupSelector: popupConfig.editFormModalWindow,
  handleFormSubmit: (data) => {
    renderLoading(editFormSaveButton, true);
    api.setUserInfo({
      name: data.userName,
      about: data.userDescription
    })
      .then((info) => {
        const userInfo = new UserInfo();
        userInfo.setUserInfo({
          userName: info.name,
          userDescription: info.about,
        })
      })
      .catch(err => console.log(`Ошибка при обновлении информации о пользователе: ${err}`))
      .finally(() => {
        renderLoading(editFormSaveButton);
      });
  },
  popupConfig: popupConfig.editFormModalWindow
});
userInfoPopup.setEventListeners();

const changeAvatarPopup = new PopupWithForm({
  popupSelector: popupConfig.changeAvatarModalWindow,
  handleFormSubmit: (data) => {
    api.setUserAvatar({
      avatar: data.avatar
    });
    const userInfo = new UserInfo();
    userInfo.setUserInfo({
      userAvatar: data.avatar,
    });
  },
  popupConfig: popupConfig.changeAvatarModalWindow
});
changeAvatarPopup.setEventListeners();

openEditFormButton.addEventListener('click', () => {
  const userInfo = new UserInfo();
  const currentUserInfo = userInfo.getUserInfo();
  titleInputValue.value = currentUserInfo.userName;
  descriptionInputValue.value = currentUserInfo.userDescription;
  userInfoPopup.open();
});

openCardFormButton.addEventListener('click', () => {
  newCardPopup.open();
});

openAvatarFormButton.addEventListener('click', () => {
  changeAvatarPopup.open();
});

api.getCardList().then((cardsArray) => {
  api.getUserInfo().then((userData) => {
    userId = userData._id;
    const userInfo = new UserInfo();
    userInfo.setUserInfo({
      userName: userData.name,
      userDescription: userData.about,
      userAvatar: userData.avatar
    });

    cardList.renderItems(cardsArray);
  })
})
  .catch(err => console.log(`Ошибка загрузки данных: ${err}`))

