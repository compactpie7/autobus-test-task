import { openSideMenu } from './ui/menuManager.js';
import { createGroupsMenu } from './ui/groupsMenu.js';
import { createContactMenu } from './ui/createContactMenu.js';
import { renderContactsList } from './ui/contactsList.js';

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('open-groups')?.addEventListener('click', () => {
        openSideMenu(createGroupsMenu());
    });

    console.log('first', document.getElementById('open-create'))
    console.log('second', document.getElementById('open-create2'))
    document.getElementById('open-create')?.addEventListener('click', async () => {
        const menu = await createContactMenu();
        openSideMenu(menu);
    });

    document.getElementById('open-create2')?.addEventListener('click', async () => {
        const menu = await createContactMenu();
        openSideMenu(menu);
    });

    const mainScreen = document.getElementById('main-screen');
    if (!mainScreen) return;

    const list = await renderContactsList();
    mainScreen.innerHTML = '';
    mainScreen.appendChild(list);
});
