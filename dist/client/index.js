import { openSideMenu } from './ui/menuManager.js';
import { createGroupsMenu } from './ui/groupsMenu.js';
import { createContactMenu } from './ui/createContactMenu.js';
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('open-groups')?.addEventListener('click', () => {
        openSideMenu(createGroupsMenu());
    });
    document.getElementById('open-create')?.addEventListener('click', () => {
        openSideMenu(createContactMenu());
    });
});
