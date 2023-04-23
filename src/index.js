// review: JS файл нужно расположить в каталоге 'src/pages'
import './index.css';
// review: изображение не используется в коде, можно удалить
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

// review: элемент является частью секции profile и можно сделать новый класс для скрытия деталей реализации этой секции
//    элементы секции могут меняться и такие изменения не должны требовать изменений в основном JS файле всей страницы
const openEditFormButton = document.querySelector('.profile__edit-button');
// review: элемент является частью секции profile и можно сделать новый класс для скрытия деталей реализации этой секции
const openCardFormButton = document.querySelector('.profile__add-button');
// review: элемент является частью секции profile и можно сделать новый класс для скрытия деталей реализации этой секции
const openAvatarFormButton = document.querySelector('.profile__image');
// review: элемент является частью формы edit-profile и нужно скрыть этот элемент в классе, который управляет элементами внутри edit-profile
//    элементы edit-profile могут меняться и такие изменения не должны требовать изменений в основном JS файле всей страницы
//    скорее всего это userInfoPopup или новый класс
const titleInputValue = document.querySelector('.popup_input_type_name');
// review: элемент является частью формы edit-profile и нужно скрыть этот элемент в классе, который управляет элементами внутри edit-profile
//    скорее всего это userInfoPopup или новый класс
const descriptionInputValue = document.querySelector('.popup_input_type_description');

// review: продублирована строковая константа popupConfig.editFormModalWindow
//    нужно использовать уже существующие константы вместо дублирования строк.
// review: элемент является частью формы внутри popup и нужно скрыть этот элемент в классе, который управляет элементами внутри popup
//    а внешний код должен вызывать публичные методы этого класса
//    либо нужное поведение можно целиком переместить во внутренние методы этого класса
const editFormSaveButton = document.querySelector(".popup_type_edit button[type='submit']");
// review: продублирована строковая константа popupConfig.cardFormModalWindow
// review: элемент является частью формы внутри popup и нужно скрыть этот элемент в классе, который управляет элементами внутри popup
//    а внешний код должен вызывать публичные методы этого класса
//    либо нужное поведение можно целиком переместить во внутренние методы этого класса
const cardFormSaveButton = document.querySelector(".popup_type_new-card button[type='submit']");

// review: нужно использовать const для неизменяемых переменных
let api = new Api({
  address: 'https://mesto.nomoreparties.co/v1',
  groupId: `cohort-23`,
  token: `eee2ea0d-1fd3-481c-aa66-4794a11da97e`,
});

// review: нужно использовать const для неизменяемых переменных
let userId = null;



// review: нужно использовать const для неизменяемых переменных
//    здесь и во всех файлах.
let cardInfoSubmit = new PopupWithFormSubmit(popupConfig.removeCardModalWindow);
cardInfoSubmit.setEventListeners();

const cardList = new Section({
    renderer: (cardData) => {
      // review: большие блоки кода следует оформлять как независимые функции вместо анонимных функций
      //    это упрощает чтение кода и понимание взаимодействий между объектами
      // review: код создания Card дублируется с newCardPopup.handleFormSubmit
      //    необходимо переделать код и избежать дублирования
      const card = new Card({
        // review: лучше передавать значение userId через явные аргументы по стеку вызовов 
        //    вместо использования неявного замыкания из анонимной функции на переменные внешнего окружения
        //    (например js позволяет добавить новое свойство в объект cardList и получать его значение через аргументы функции renderer)
        //    Явный аргумент упростит понимание общей архитектуры/последовательности вызовов/зависимостей
        //    и уменьшит количество ошибочных вызовов этого метода когда значение в глобальную переменную еще не присвоено.
        data: { ...cardData, currentUserId: userId },
        handleCardClick: () => {
          // review: на каждый вызов создается новый инстанс PopupWithImage для одного и того же DOM элемента 
          //    и каждый инстанс добавляет обработчики событий
          //    нужно заранее создать один объект PopupWithImage и использовать его
          // review: нужно использовать const для неизменяемых переменных
          let imagePopup = new PopupWithImage(popupConfig.imageModalWindow);
          imagePopup.setEventListeners();
          imagePopup.open(cardData);
        },
        handleLikeClick: (card) => {
          // review: можно добавить визуальную индикацию и блокировку контролов при выполнении этой длительной асинхронной операции (disabled/opacity/in progress).
          api.changeLikeCardStatus(card.id(), !card.isLiked())
            .then(data => {
              card.setLikesInfo({ ...data });
              // review: код управления элементом 'card__like-count' дублируется с кодом Card.getView
              //    Нужно реорганизовать код что бы он был написан один раз
              // review: селектор и способ показа счетчика являются деталями
              //    внутренней реализации класса Card. Эти детали должны быть скрыты
              //    а внешний код должен использовать специальный публичный метод класса Card
              //    например это может делать метод Card.setLikesInfo
              card.getElement().querySelector('.card__like-count').textContent = data.likes.length;

              // review: код дублируется с кодом Card.getView
              // review: селектор и управление счетчиком являются деталями
              //    внутренней реализации класса Card. Эти детали должны быть скрыты
              //    а внешний код должен использовать специальный публичный метод класса Card
              //    например это может делать метод Card.setLikesInfo
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
            // review: можно добавить визуальную индикацию и блокировку контролов при выполнении этой длительной асинхронной операции (disabled/opacity/in progress).
            // review: нет обработки ошибок при выполнении кода removeCard
            api.removeCard(card.id());
            // review: нет ожидания выполнения запроса на серверной стороне
            //    удаление карточки из DOM элементов нужно сделать только после успешного окончания операции на сервере
            // review: можно сделать метод `cardList.removeItem` для удаления элемента карточки из DOM
            //    как это уже сделано для добавления `cardList.addItem`
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
    // review: Отлично: есть код блокировки кнопки и показа на ней текста "Загрузка..."
    //    на время выполнения длительной асинхронной операции
    //    Но код popup не предусматривает асинхронные операции, форма будет немедленно закрыта
    //    и пользователь не увидит эти изменения
    //    По заданию "уведомите пользователя о процессе загрузки ...  для формы добавления новой карточки и обновления аватара."
    renderLoading(cardFormSaveButton, true);
    api.addCard(data)
      .then((cardData) => {
        // review: код создания Card дублируется с Section.renderer
        //    Нужно реорганизовать код что бы он был написан один раз
        //    все комментарии для этого кода находятся в Section.renderer
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

        // review: выполняется повторный поиск одного и того же DOM элемента при каждом вызове метода
        //    это замедляет загрузку и отклики страницы
        //    нужно выполнить поиск один раз, сохранить DOM элемент в объекте Section и повторно использовать его
        // review: структура и классы этих DOM элементов является деталями внутренней реализации блока Section
        //    нужно добавить новый метод в класс Section для добавления дочернего элемента и скрыть эти детали
        //    из основного JS кода страницы
        //    например можно использовать метод addItem
        document.querySelector(`.${cardsConfig.placesWrap}`).append(card.getView());
      })
      .catch(err => console.log(`Ошибка добавления карточки: ${err}`))
      // review: Отлично: использован finally. Другие "отлично" не добавлял, не понятно нужно это сейчас или нет.
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
        // review: нужно создать один инстанс объекта UserInfo и использовать его
        //    потому что UserInfo всегда работает с одними и теми же DOM элементами
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
    // review: нет обработки ошибок при выполнении setUserAvatar
    // review: нет визуальной индикации и блокировки контролов при выполнении длительной асинхронной операции (disabled/opacity/in progress).
    //    страница позволяет повторное выполнение этой или других операций пока не закончена начатая,
    //    это может приводить к ошибкам и усложнять взаимодействие пользователя со страницей
    //    По заданию "уведомите пользователя о процессе загрузки ...  для формы добавления новой карточки и обновления аватара."
    api.setUserAvatar({
      avatar: data.avatar
    });
    // review: нужно создать один инстанс объекта UserInfo и использовать его
    //    потому что UserInfo всегда работает с одними и теми же DOM элементами
    const userInfo = new UserInfo();
    // review: нет ожидания выполнения запроса на серверной стороне
    //    изменение в элементах интерфейса нужно сделать только после успешного выполнения серверной операции
    userInfo.setUserInfo({
      userAvatar: data.avatar,
    });
  },
  popupConfig: popupConfig.changeAvatarModalWindow
});
changeAvatarPopup.setEventListeners();

// review: элемент openEditFormButton является частью секции profile 
//    и можно сделать новый класс для скрытия деталей реализации этой секции из основного JS файла всей страницы
openEditFormButton.addEventListener('click', () => {
  const userInfo = new UserInfo();
  const currentUserInfo = userInfo.getUserInfo();
  // review: элемент titleInputValue является деталями внутренней реализации формы edit-profile
  //    нужно скрыть этот элемент в классе, который управляет элементами внутри edit-profile
  //    скорее всего это userInfoPopup или новый класс для формы редактирования userInfo
  //    в этом методе нужно вызвать метод этого класса и передать в него значения для редактирования, например setUserInfo({name, description})
  titleInputValue.value = currentUserInfo.userName;
  // review: элемент descriptionInputValue является деталями внутренней реализации формы edit-profile
  //    и нужно скрыть этот элемент в классе, который управляет элементами внутри edit-profile
  descriptionInputValue.value = currentUserInfo.userDescription;
  userInfoPopup.open();
});

// review: элемент openCardFormButton является частью секции profile
//    и можно сделать новый класс для скрытия деталей реализации этой секции из основного JS файла всей страницы
openCardFormButton.addEventListener('click', () => {
  newCardPopup.open();
});

// review: элемент openAvatarFormButton является частью секции profile 
//    и можно сделать новый класс для скрытия деталей реализации этой секции из основного JS файла всей страницы
openAvatarFormButton.addEventListener('click', () => {
  changeAvatarPopup.open();
});

api.getCardList().then((cardsArray) => {
  // review: нет обработки ошибок при выполнении getUserInfo и ошибок при обработке его результатов
  //    catch написан только для операции getCardList
  // review: можно выполнять запросы одновременно (например через Promise.all)
  //    Сейчас запрос данных UserInfo начинается только после окончания получения данных CardList от сервера.
  //    Это увеличивает общее время загрузки страницы
  api.getUserInfo().then((userData) => {
    userId = userData._id;
    // review: нужно создать один инстанс объекта UserInfo и использовать его
    //    потому что UserInfo всегда работает с одними и теми же DOM элементами
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

