import { openSideMenu } from './ui/menuManager.js';
import { createGroupsMenu } from './ui/groupsMenu.js';
import { createContactMenu } from './ui/createContactMenu.js';
import { renderContactsList } from './ui/contactsList.js';
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('open-groups')?.addEventListener('click', () => {
        openSideMenu(createGroupsMenu());
    });
    document.getElementById('open-create')?.addEventListener('click', async () => {
        const menu = await createContactMenu(); // ✅ wait for the element
        openSideMenu(menu); // ✅ now it's an HTMLElement
    });
    const mainScreen = document.getElementById('main-screen');
    if (!mainScreen)
        return;
    const list = await renderContactsList();
    mainScreen.innerHTML = '';
    mainScreen.appendChild(list);
});
