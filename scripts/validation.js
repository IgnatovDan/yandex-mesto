function createFormValidation({ formEl, submitButtonClass, inputWithMessageClass, inputMessageClass, inputInvalidClass }) {
  const result = {
    formEl, inputWithMessageClass, inputMessageClass, inputInvalidClass
  };

  result.submitButtonEl = result.formEl.querySelector(`.${submitButtonClass}`);
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
      // element.validity.valid is updated only for empty/pattern rules if element.value is changed from js code
      messageEl.textContent = '';
      evt.target.classList.remove(inputInvalidClass);
    }
    else {
      // can be better: implement smooth show/hide similar to popup show/hide
      messageEl.textContent = evt.target.validationMessage;
      evt.target.classList.add(inputInvalidClass);
    }
  };

  result.resetValidationState = () => {
    result.inputWithMessageList?.forEach((item) => {
      item.messageEl.textContent = '';
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
