export function createGroupsMenu() {
    const wrapper = document.createElement('div');
    wrapper.className = 'group-side-menu side-menu';
    const ul = document.createElement('ul');
    ul.id = 'groups-list';
    wrapper.append(ul);
    return wrapper;
}
