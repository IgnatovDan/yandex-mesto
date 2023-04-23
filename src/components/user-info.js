// review: класс не соответствует требованиям задания: "Принимает в конструктор объект с селекторами"
class UserInfo {
  getUserInfo() {
    return {
      // review: на каждом вызове происходит поиск элемента по селектору, который всегда возвращает один и тот же DOM элемент
      //    Нужно выполнить поиск один раз, сохранить ссылку на DOM элемент и использовать ее вместо поиска
      // review: использован document для поиска элемента и могут быть найдены неверные DOM элементы
      //    потому что возможно использование таких же классов на других элементах страницы
      //    Нужно из вызывающего кода передать корневой DOM элемент блока UserInfo или его уникальный селектор
      //    и использовать его для поиска дочерних элементов блока
      userName: document.querySelector(`.profile__title`).textContent,
      userDescription: document.querySelector(`.profile__description`).textContent,
      userAvatar: document.querySelector(`.profile__image`).style.backgroundImage.slice(5, -2)
    }
  }

  setUserInfo({ userName, userDescription, userAvatar }) {
    // review: повторно написаны строковые константы. Вместо многократного написания одинаковых строк 
    //    нужно объявить одну переменную для каждой строки и везде использовать эту переменную.
    //    здесь и во всем файле
    // review: использован innerHTML, который позволяет внедрять на страницу разметку из пользовательских текстов
    //    вместо него нужно использовать textContent
    // review: на каждом вызове происходит поиск элемента по селектору
    //    здесь и во всем методе
    // review: использован document для поиска элемента и могут быть найдены неверные DOM элементы
    // review: код оставляет в едиторах прежнее значение если передан null/undefined/String.Empty
    //    Нужно безусловно показать любое переданное значение (эта логика не должна зависеть от validation правил на странице или на сервере)
    //    здесь и далее.
    if (userName) document.querySelector(`.profile__title`).innerHTML = userName;
    // review: использован innerHTML
    if (userDescription) document.querySelector(`.profile__description`).innerHTML = userDescription;
    if (userAvatar) document.querySelector(`.profile__image`).style.backgroundImage = `url(${userAvatar})`;
  }
}

export default UserInfo;
