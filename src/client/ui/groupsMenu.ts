// ui/groupsMenu.ts
import { closeSideMenu } from './menuManager.js';

export function createGroupsMenu(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'group-side-menu side-menu';

    const ul = document.createElement('ul');
    ul.id = 'groups-list';

    wrapper.append(ul);
    return wrapper;
}
