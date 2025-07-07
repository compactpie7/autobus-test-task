// ui/createContactMenu.ts
import { closeSideMenu } from './menuManager';

export function createContactMenu(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'side-menu';

    const form = document.createElement('form');

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Имя';

    const phoneInput = document.createElement('input');
    phoneInput.type = 'text';
    phoneInput.placeholder = 'Телефон';

    const groupSelect = document.createElement('select');
    ['Друзья', 'Семья', 'Работа'].forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        groupSelect.appendChild(option);
    });

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Создать';

    form.append(nameInput, phoneInput, groupSelect, submitBtn);

    form.onsubmit = (e) => {
        e.preventDefault();
        console.log('Создан контакт:', {
            name: nameInput.value,
            phone: phoneInput.value,
            group: groupSelect.value
        });
        closeSideMenu();
    };

    wrapper.appendChild(form);
    return wrapper;
}
