class Api {
  constructor({ address, token, groupId }) {
    // review: сделано лишнее дробление url на части address и groupId
    //    Они являются внутренними деталями реализации внешнего кода и увеличивают зависмость этого класса от внешнего кода.
    //    Нужно передавать готовую url серверного сервиса.
    this._token = token;
    this._groupId = groupId;
    this._address = address;
  }

  getCardList() {
    return fetch(`${this._address}/${this._groupId}/cards`, {
      headers: {
        authorization: this._token
      }
    })
      // review: не обработан `res.ok` для всех запросов в этом файле
      //    для (!res.ok) нужно вернуть Promise.reject(`Ошибка: ${res.status}`)
      .then(res => res.json())
      // review: обработку ошибки через catch нужно расположить снаружи этой функции для визуального отображения ошибки
      .catch(err => console.log(`Ошибка: ${err}`))
  }

  addCard({ name, link }) {
    return fetch(`${this._address}/${this._groupId}/cards`, {
      method: 'POST',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        link
      })
    })
      .then(res => res.json())
      // review: обработку ошибки нужно расположить снаружи этой функции для визуального отображения ошибки
      .catch(err => console.log(`Ошибка: ${err}`))
  }

  removeCard(cardID) {
    fetch(`${this._address}/${this._groupId}/cards/${cardID}`, {
      method: 'DELETE',
      headers: {
        authorization: this._token,
      }
    })
  }

  getUserInfo() {
    return fetch(`${this._address}/${this._groupId}/users/me`, {
      headers: {
        authorization: this._token
      }
    })
      .then(res => res.json())
  }

  setUserInfo({ name, about }) {
    return fetch(`${this._address}/${this._groupId}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        about
      })
    })
      .then(res => res.json())
  }

  setUserAvatar({ avatar }) {
    fetch(`${this._address}/${this._groupId}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar
      })
    })
  }

  changeLikeCardStatus(cardID, like) {
    return fetch(`${this._address}/${this._groupId}/cards/likes/${cardID}`, {
      method: like ? 'PUT' : 'DELETE',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
  }
}

export default Api;
