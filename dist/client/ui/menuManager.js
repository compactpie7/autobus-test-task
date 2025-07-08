// ui/menuManager.ts
export function openSideMenu(content) {
    // Check if menu already opened
    if (document.getElementById('side-menu-wrapper')) {
        return; // Menu is open, do nothing
    }
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
