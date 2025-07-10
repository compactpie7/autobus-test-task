import { CloseBtn } from './closeBtn.js';

export function FormHeader(title: string, onClose: () => void): HTMLElement {
    const header = document.createElement('div');
    header.className = 'side-menu-form-header';

    const h2 = document.createElement('h2');
    h2.className = 'contacts-side-menu-title';
    h2.textContent = title;

    const closeButton = CloseBtn(() => onClose());

    header.append(h2, closeButton);
    return header;
}
