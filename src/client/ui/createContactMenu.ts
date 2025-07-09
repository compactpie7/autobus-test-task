import { closeSideMenu } from './menuManager.js';
import { Btn } from '../components/Btn.js';
import { FormHeader } from '../components/FormHeader.js';
import { Contact, fetchGroups } from '../api/groupsApi.js';
import { handleContactFormSubmit } from '../api/contactFormHandler.js';

export async function createContactMenu(contact?: Contact, groupId?: number): Promise<HTMLElement> {
    const wrapper = document.createElement('div');
    wrapper.className = 'contact-side-menu side-menu';

    const formHeader = FormHeader(contact ? 'Редактирование контакта' : 'Добавление контакта', closeSideMenu);

    const form = document.createElement('form');
    form.className = 'contact-side-menu-form';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Введите ФИО';
    nameInput.className = 'side-menu-form-input';
    nameInput.required = true;
    nameInput.value = contact?.name ?? '';

    const phoneInput = document.createElement('input');
    phoneInput.type = 'text';
    phoneInput.placeholder = 'Введите номер';
    phoneInput.className = 'side-menu-form-input';
    phoneInput.required = true;
    phoneInput.value = contact?.phone ?? '';

    const groupDropdown = document.createElement('div');
    groupDropdown.className = 'custom-dropdown side-menu-form-input';

    const selected = document.createElement('div');
    selected.className = 'selected-option';
    selected.textContent = 'Выберите группу';

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'group';

    let selectedValue = '';
    try {
        const groups = await fetchGroups();

        groups.forEach(group => {
            const option = document.createElement('div');
            option.className = 'custom-option';
            option.textContent = group.name;
            option.onclick = () => {
                selected.textContent = group.name;
                selectedValue = group.name;
                hiddenInput.value = group.name;
                optionsContainer.classList.remove('open');
                selected.classList.remove('open');
            };
            optionsContainer.appendChild(option);

            if (groupId === group.id) {
                selected.textContent = group.name;
                selectedValue = group.name;
                hiddenInput.value = group.name;
            }
        });
    } catch (err) {
        const error = document.createElement('div');
        error.textContent = 'Ошибка загрузки групп';
        error.style.color = 'red';
        groupDropdown.appendChild(error);
    }

    selected.onclick = () => {
        optionsContainer.classList.toggle('open');
        selected.classList.toggle('open');
    };

    groupDropdown.append(hiddenInput, selected, optionsContainer);

    const submitBtn = Btn('Сохранить', undefined, '', true);
    const formBtnGroup = document.createElement('div');
    formBtnGroup.className = 'form-btn-group';
    formBtnGroup.append(submitBtn);

    form.onsubmit = (e) => handleContactFormSubmit(e, contact, groupId, nameInput, phoneInput, selectedValue);


    form.append(nameInput, phoneInput, groupDropdown, formBtnGroup);
    wrapper.append(formHeader, form);

    document.addEventListener('click', (e) => {
        if (!groupDropdown.contains(e.target as Node)) {
            optionsContainer.classList.remove('open');
            selected.classList.remove('open');
        }
    });

    return wrapper;
}
