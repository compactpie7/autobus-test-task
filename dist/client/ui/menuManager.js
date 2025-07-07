// ui/menuManager.ts
export function openSideMenu(content) {
    closeSideMenu(); // Remove existing menu
    const wrapper = document.createElement('div');
    wrapper.id = 'side-menu-wrapper';
    wrapper.appendChild(content);
    document.body.appendChild(wrapper);
    requestAnimationFrame(() => {
        wrapper.classList.add('open');
    });
}
export function closeSideMenu() {
    const existing = document.getElementById('side-menu-wrapper');
    if (existing)
        existing.remove();
}
