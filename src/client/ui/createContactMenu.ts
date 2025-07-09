import { closeSideMenu } from './menuManager.js';
import { CloseBtn } from '../components/closeBtn.js';
import { Btn } from '../components/Btn.js';
import { FormHeader } from '../components/FormHeader.js';
import { fetchGroups } from '../api/groupsApi.js';

export async function createContactMenu(): Promise<HTMLElement> {
    const wrapper = document.createElement('div');
    wrapper.className = 'contact-side-menu side-menu';

    const formHeader = FormHeader('Добавление контакта', closeSideMenu);

    const form = document.createElement('form');
    form.className = 'contact-side-menu-form';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Введите ФИО';
    nameInput.className = 'side-menu-form-input';
    nameInput.required = true;

    const phoneInput = document.createElement('input');
    phoneInput.type = 'text';
    phoneInput.placeholder = 'Введите номер';
    phoneInput.className = 'side-menu-form-input';
    phoneInput.required = true;

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
    groupDropdown.appendChild(hiddenInput);

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
        });
    } catch (err) {
        console.error('Ошибка загрузки групп:', err);
        const errorMsg = document.createElement('div');
        errorMsg.textContent = 'Ошибка загрузки групп';
        errorMsg.style.color = 'red';
        groupDropdown.appendChild(errorMsg);
    }

    selected.onclick = () => {
        optionsContainer.classList.toggle('open');
        selected.classList.toggle('open');
    };

    groupDropdown.append(selected, optionsContainer);

    const submitBtn = Btn('Сохранить', undefined, '', true);
    const formBtnGroup = document.createElement('div');
    formBtnGroup.className = 'form-btn-group';
    formBtnGroup.append(submitBtn);


    form.append(
        nameInput,
        phoneInput,
        groupDropdown,
        formBtnGroup
    );

    form.onsubmit = (e) => {
        e.preventDefault();
        console.log('Создан контакт:', {
            name: nameInput.value,
            phone: phoneInput.value,
            group: selectedValue || null
        });
        closeSideMenu();
    };

    document.addEventListener('click', (event: MouseEvent) => {
        if (!groupDropdown.contains(event.target as Node)) {
            optionsContainer.classList.remove('open');
            selected.classList.remove('open');
        }
    });

    wrapper.append(formHeader, form);
    return wrapper;
}
