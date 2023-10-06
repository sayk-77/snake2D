// Функция, которая открывает модальное окно при проигрыше
function openModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
}

// Функция, которая закрывает модальное окно
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Обработчик события для кнопки "Начать сначала"
const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', () => {
    closeModal();
    window.location.reload();
});
