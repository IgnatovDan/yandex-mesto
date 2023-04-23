class UserInfo {
  getUserInfo() {
    return {
      userName: document.querySelector(`.profile__title`).textContent,
      userDescription: document.querySelector(`.profile__description`).textContent,
      userAvatar: document.querySelector(`.profile__image`).style.backgroundImage.slice(5, -2)
    }
  }

  setUserInfo({ userName, userDescription, userAvatar }) {
    if (userName) document.querySelector(`.profile__title`).innerHTML = userName;
    if (userDescription) document.querySelector(`.profile__description`).innerHTML = userDescription;
    if (userAvatar) document.querySelector(`.profile__image`).style.backgroundImage = `url(${userAvatar})`;
  }
}

export default UserInfo;
