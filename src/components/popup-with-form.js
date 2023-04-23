import Popup from './popup.js';
import FormValidator from './form-validator.js';
import { defaultFormConfig} from '../utils/constants.js';

class PopupWithForm extends Popup {
  constructor({ popupSelector, handleFormSubmit, popupConfig }) {
    super(popupSelector);

    // review: это свойство хранит имя класса в виде строки и нужно назвать его по шаблону ХхClassName
    //    использование слова Config подразумевает ссылку на объект с несколькими свойствами
    //    и усложняет понимание кода
    this._popupConfig = popupConfig;
    this._validator = new FormValidator(defaultFormConfig, popupConfig);

    // review: продублировано значение строковой константы defaultFormConfig.formSelector
    //    нужно использовать константу вместо нового строкового выражения
    this._popupForm = this._popupElement.querySelector('.popup__form');
    this._handleFormSubmit = handleFormSubmit;
  }

  _getInputValues() {
    // review: продублировано значение строковой константы defaultFormConfig.inputSelector
    this._inputList = this._popupElement.querySelectorAll('.popup_input');

    // review: продублировано значение строковой константы popupConfig.editFormModalWindow
    // review: занесение констант и получения данных для различных форм во внутренний  код класса PopupWithForm
    //    повышает его зависимость от внешнего кода (при добавлении новой формы потребуется менять код этого класса)
    //    и ухудшает возможности для повторного использования класса
    //    нужно вынести этот код из класса PopupWithForm в вызывающий код или добавить отдельный класс для каждой формы
    if (this._popupConfig === 'popup_type_edit') {
      return {
        // review: для обращения к едиторам нельзя использовать индексы, порядок элементов в массиве может поменяться.
        //    вместо доступа по индексам нужно использовать явное обращение по name едиторов (form.elements.title)
        //    или другой способ именованного доступа
        userName: this._inputList[0].value,
        userDescription: this._inputList[1].value
      }
    }

    // review: продублировано значение строковой константы из popupConfig
    if (this._popupConfig === 'popup_type_new-card') {
      return {
        // review: для обращения к едиторам нельзя использовать индексы, порядок элементов в массиве может поменяться
        //    (например при изменении разметки)
        name: this._inputList[0].value,
        link: this._inputList[1].value
      }
    }

    // review: продублировано значение строковой константы из popupConfig
    if (this._popupConfig === 'popup__edit-avatar') {
      return {
        avatar: this._inputList[0].value
      }
    }
  }

  open() {
    // review: при повторном открытии эдиторы показывают предыдущие значения
    //    нужно показывать пустые строки при открытии формы для добавления новой карточки или для изменения изображения avatar
    this._validator.enableValidation();
    super.open();
  }

  setEventListeners() {
    this._popupElement.addEventListener('submit', () => {
      // review: _handleFormSubmit выполняет длительные асинхронные операции,
      //    но форма все равно будет немедленно закрыта сразу при выходе управления из функции _handleFormSubmit
      //    Текущая реализация делает невозможной визуальную индикацию длительной асинхронной операции
      //    средствами формы (например, disable для кнопки submit или изменение ее текста на "Загрузка...")
      //    и не предусматривает показ ошибок асинхронной операции на элементах формы
      //    или повторное сохранение если произошла ошибка
      this._handleFormSubmit(this._getInputValues());
      this.close();
    });

    super.setEventListeners();
  }
  // review: не переопределен метод закрытия popup для удаления введенных текстов, 
  //    при повторном открытии эдиторы показывают предыдущие значения
}

export default PopupWithForm;
