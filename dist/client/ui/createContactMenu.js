// ui/createContactMenu.ts
import { closeSideMenu } from './menuManager.js';
import { CloseBtn } from '../components/closeBtn.js';
import { Btn } from '../components/Btn.js';
import { FormHeader } from '../components/FormHeader.js';
export function createContactMenu() {
    const wrapper = document.createElement('div');
    wrapper.className = 'contact-side-menu side-menu';
    const form = document.createElement('form');
    form.className = "contact-side-menu-form";
    function someFunctionDoingQuery() { }
    // Buttons
    const submitBtn = Btn("Сохранить", someFunctionDoingQuery, "", true);
    const closeBtn = CloseBtn(closeSideMenu);
    const formBtnGroup = document.createElement('div');
    formBtnGroup.className = "form-btn-group";
    formBtnGroup.append(closeBtn, submitBtn);
    const formHeader = FormHeader("Добавление контакта", closeSideMenu);
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Введите ФИО';
    nameInput.className = "contact-side-menu-form-input";
    nameInput.required = true;
    const phoneInput = document.createElement('input');
    phoneInput.type = 'text';
    phoneInput.placeholder = 'Введите номер';
    phoneInput.className = "contact-side-menu-form-input";
    phoneInput.required = true;
    // Custom dropdown setup
    const groupDropdown = document.createElement('div');
    groupDropdown.className = 'custom-dropdown contact-side-menu-form-input';
    const selected = document.createElement('div');
    selected.className = 'selected-option';
    selected.textContent = 'Выберите группу';
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    const groupOptions = ['Друзья', 'Семья', 'Работа']; //There should be an query to API with fetching groups
    let selectedValue = '';
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'group'; // Make sure to match whatever your backend expects
    groupDropdown.appendChild(hiddenInput);
    groupOptions.forEach(group => {
        const option = document.createElement('div');
        option.className = 'custom-option';
        option.textContent = group;
        option.onclick = () => {
            selected.textContent = group;
            selectedValue = group;
            hiddenInput.value = group;
            optionsContainer.classList.remove('open');
        };
        optionsContainer.appendChild(option);
    });
    selected.onclick = () => {
        optionsContainer.classList.toggle('open');
        selected.classList.toggle('open');
    };
    groupDropdown.append(selected, optionsContainer);
    form.append(formHeader, nameInput, phoneInput, groupDropdown, formBtnGroup);
    function handleClickOutside(event) {
        if (!groupDropdown.contains(event.target)) {
            optionsContainer.classList.remove('open');
            selected.classList.remove('open');
        }
    }
    document.addEventListener('click', handleClickOutside);
    form.onsubmit = (e) => {
        e.preventDefault();
        console.log('Создан контакт:', {
            name: nameInput.value,
            phone: phoneInput.value,
            group: selectedValue || null
        });
        closeSideMenu();
    };
    wrapper.appendChild(form);
    return wrapper;
}
