// ui/menuManager.ts
export function openSideMenu(content) {
    console.log('opening menu with:', content); // Add this line
    if (document.getElementById('side-menu-wrapper'))
        return;
    const wrapper = document.createElement('div');
    wrapper.id = 'side-menu-wrapper';
    wrapper.appendChild(content); // 💥 Fails here if 'content' is not HTMLElement
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
