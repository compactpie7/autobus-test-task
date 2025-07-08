// ui/menuManager.ts
export function openSideMenu(content) {
    closeSideMenu(); // Remove existing menu
    const wrapper = document.createElement('div');
    wrapper.id = 'side-menu-wrapper';
    wrapper.appendChild(content);
    const mainScreen = document.getElementById('main-screen');
    mainScreen?.append(wrapper);
    requestAnimationFrame(() => {
        wrapper.classList.add('open');
    });
}
export function closeSideMenu() {
    const existing = document.getElementById('side-menu-wrapper');
    if (!existing)
        return;
    existing.classList.remove('open');
    const handleTransitionEnd = () => {
        existing.removeEventListener('transitionend', handleTransitionEnd);
        existing.remove();
    };
    existing.addEventListener('transitionend', handleTransitionEnd);
}
