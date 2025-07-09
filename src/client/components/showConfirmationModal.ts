import { Btn } from './Btn.js';

export function showConfirmationModal(
    titleText: string,
    descriptionText: string,
    onConfirm: () => void,
    onCancel?: () => void
) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';

    const title = document.createElement('h2');
    title.textContent = titleText;

    const description = document.createElement('p');
    description.textContent = descriptionText;

    const confirmBtn = Btn('Да, удалить', () => {
        overlay.remove();
        onConfirm();
    });

    const cancelBtn = Btn('Отмена', () => {
        overlay.remove();
        if (onCancel) onCancel();
    }, 'btn-transparent');

    const btnGroup = document.createElement('div');
    btnGroup.className = 'modal-btn-group';
    btnGroup.append(confirmBtn, cancelBtn);

    modal.append(title, description, btnGroup);
    overlay.append(modal);
    document.body.appendChild(overlay);
}
