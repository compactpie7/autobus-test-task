// ui/groupsMenu.ts
import { closeSideMenu } from './menuManager.js';

export function createGroupsMenu(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'side-menu';

    const ul = document.createElement('ul');
    ul.id = 'groups-list';

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Добавить группу';
    addBtn.onclick = () => {
        const li = document.createElement('li');
        const input = document.createElement('input');
        input.type = 'text';
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '💾';
        saveBtn.onclick = () => {
            const value = input.value.trim();
            if (value) {
                li.textContent = value;
            }
        };
        li.appendChild(input);
        li.appendChild(saveBtn);
        ul.appendChild(li);
    };

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Закрыть';
    closeBtn.onclick = closeSideMenu;

    wrapper.append(ul, addBtn, closeBtn);
    return wrapper;
}
