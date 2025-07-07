import { openSideMenu } from './ui/menuManager';
import { createGroupsMenu } from './ui/groupsMenu';
import { createContactMenu } from './ui/createContactMenu';
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('open-groups')?.addEventListener('click', () => {
        openSideMenu(createGroupsMenu());
    });
    document.getElementById('open-create')?.addEventListener('click', () => {
        openSideMenu(createContactMenu());
    });
});
