function createFormValidation({ formEl, submitButtonClass, submitButtonDisabledClass, inputWithMessageClass, inputMessageClass, inputInvalidClass, }) {
  const result = {
    formEl, inputWithMessageClass, inputMessageClass, inputInvalidClass
  };

  result.submitButtonEl = result.formEl.querySelector(`.${submitButtonClass}`);
  result.inputWithMessageList = Array.from(result.formEl.querySelectorAll(`.${inputWithMessageClass}`)).map(
    (itemEl) => {
      // Or, I can find 'messageEl' by 'input.id': messageEl = itemEl.querySelector(`.${inputEl.id}-error`);
      return { inputEl: itemEl.querySelector('input'), messageEl: itemEl.querySelector(`.${inputMessageClass}`) };
    }
  );

  result._refreshFormSubmit = () => {
    const hasInvalidInput = !!result.formEl.querySelectorAll(`input:invalid`).length;
    result.submitButtonEl.classList.toggle(submitButtonDisabledClass, hasInvalidInput);
    result.submitButtonEl.disabled = hasInvalidInput;
  };

  result._setInputValidationState = ({ inputEl, messageEl, validationMessage }) => {
    // Note: element.validity.valid/validationMessage are updated only for empty/pattern rules
    // if element.value is changed from js code
    if (!validationMessage) {
      messageEl.textContent = '';
      inputEl.classList.remove(inputInvalidClass);
    }
    else {
      // can be better: implement smooth show/hide similar to popup show/hide
      messageEl.textContent = validationMessage;
      inputEl.classList.add(inputInvalidClass);
    }
  };

  result._inputHandler = (evt) => {
    result._refreshFormSubmit();
    const messageEl = evt.target.closest(`.${inputWithMessageClass}`).querySelector(`.${inputMessageClass}`);
    result._setInputValidationState({ inputEl: evt.target, messageEl, validationMessage: evt.target.validationMessage });
  };

  result.resetValidationState = () => {
    result.inputWithMessageList?.forEach((item) => {
      result._setInputValidationState({ inputEl: item.inputEl, messageEl: item.messageEl, validationMessage: '' });
    });
    result._refreshFormSubmit();
  };

  result._refreshFormSubmit();

  result.inputWithMessageList.forEach((item) => {
    item.messageEl.content = '';
    item.inputEl.classList.remove(inputInvalidClass);

    // Or, use event bubble: formEl/inputGroupEl.addEventListener('input'
    // I prefer subscribing exactly to the target element
    // Note: If value is changed from js code then 'input' event doesn't occur
    // and the 'form__input:invalid' is updated for 'valueMissing' and NOT updated for 'tooShort'
    item.inputEl.addEventListener('input', result._inputHandler);
  });

  return result;
}
