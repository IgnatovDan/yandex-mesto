function createFormValidation({ formEl, submitButtonEl, inputWithMessageClass, inputMessageClass, inputInvalidClass }) {
  const result = {
    formEl, submitButtonEl, inputWithMessageClass, inputMessageClass, inputInvalidClass
  };

  result.inputWithMessageList = Array.from(result.formEl.querySelectorAll(`.${inputWithMessageClass}`)).map(
    (itemEl) => {
      return { inputEl: itemEl.querySelector('input'), messageEl: itemEl.querySelector(`.${inputMessageClass}`) };
    }
  );

  result._refreshFormSubmit = () => {
    // Or: hasInvalidInput = !!formEl.querySelector('input:invalid');
    const hasInvalidInput = !!result.formEl.querySelectorAll(`input:invalid`).length;
    result.submitButtonEl.classList.toggle('form__save_disabled', hasInvalidInput);
    result.submitButtonEl.disabled = hasInvalidInput;
  }

  result._inputHandler = (evt) => {
    result._refreshFormSubmit();
    const messageEl = evt.target.closest(`.${inputWithMessageClass}`).querySelector(`.${inputMessageClass}`);
    if (evt.target.validity.valid) {
      // element.validity.valid is not updated only for empty/pattern rules if element.value is changed from js code
      messageEl.textContent = '';
      evt.target.classList.remove(inputInvalidClass);
    }
    else {
      // can be better: implement smooth show/hide similar to popup show/hide
      messageEl.textContent = evt.target.validationMessage;
      evt.target.classList.add(inputInvalidClass);
    }
  };

  result.dispose = () => {
    result.inputWithMessageList?.forEach((item) => {
      item.inputEl.removeEventListener('input', result._inputHandler);
      item.messageEl.textContent = '';
    });
    result.inputWithMessageList = [];
    result.formEl = null;
    result.submitButtonEl = null;
  };

  result._refreshFormSubmit();

  result.inputWithMessageList.forEach((item) => {
    item.messageEl.content = '';
    item.inputEl.classList.remove(inputInvalidClass);

    // Or, use event bubble: inputGroupEl.addEventListener('input', (evt) => {
    // I prefer subscribing to the exactly target element
    // Note: If value is changed from js code then 'input' event doesn't occur
    // and the 'form__input:invalid' is updated for 'valueMissing' and NOT updated for 'tooShort'
    item.inputEl.addEventListener('input', result._inputHandler);
  });

  return result;
}
