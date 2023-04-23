export const renderLoading = (button, isLoading = false) => {
  if (isLoading) {
    button.textContent = 'Загрузка...';
    return;
  }
  button.textContent = 'Сохранить';
};
