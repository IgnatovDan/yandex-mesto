let profileNameEl = document.querySelector('.profile__name');
let profileDetailsEl = document.querySelector('.profile__details');
let profileEditEl = document.querySelector('.profile__edit');

let overlayEl = document.querySelector('.overlay');
let overlayCloseEl = overlayEl.querySelector('.overlay__close');

// Находим форму в DOM
let profileFormEl = document.querySelector('.profile-form'); // Воспользуйтесь методом querySelector()

// Находим поля формы в DOM
let profileFormNameInput = profileFormEl.querySelector('.profile-form__input_name'); // Воспользуйтесь инструментом .querySelector()
let profileFormDetailsInput = profileFormEl.querySelector('.profile-form__input_details'); // Воспользуйтесь инструментом .querySelector()

function hideOverlay() {
  overlayEl.classList.add('overlay_hidden');
}

function showOverlay() {
  overlayEl.classList.remove('overlay_hidden');
}

function showProfileEditForm() {
  profileFormNameInput.value = profileNameEl.textContent;
  profileFormDetailsInput.value = profileDetailsEl.textContent;
  showOverlay();
}

function hideProfileEditForm({ saveChanges }) {
  if (saveChanges) {
    profileNameEl.textContent = profileFormNameInput.value;
    profileDetailsEl.textContent = profileFormDetailsInput.value;
  }
  profileFormNameInput.value = '';
  profileFormDetailsInput.value = '';
  hideOverlay();
}

// Обработчик «отправки» формы, хотя пока
// она никуда отправляться не будет
function profileEditFormSubmitHandler(evt) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
  // Так мы можем определить свою логику отправки.
  // О том, как это делать, расскажем позже.

  hideProfileEditForm({ saveChanges: true });
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
profileFormEl.addEventListener('submit', profileEditFormSubmitHandler);
overlayCloseEl.addEventListener('click', hideProfileEditForm);
profileEditEl.addEventListener('click', showProfileEditForm);
