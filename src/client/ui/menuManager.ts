export function openSideMenu(content: HTMLElement) {
    if (document.getElementById('side-menu-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'side-menu-wrapper';
    wrapper.appendChild(content);

    const blackout = document.createElement('button');
    blackout.id = 'menu-blackout'
    blackout.onclick = closeSideMenu
    blackout.style = "opacity: 0.3; position: fixed; left: 0; top: 0; height: 100%; width: 100%; z-index: 8888; background-color: #000;"
    blackout.disabled = false
    const bodyDOM = document.body
    blackout.classList.add("blackout-show");

    bodyDOM.append(blackout)

    const mainScreen = document.getElementById('main-screen');
    mainScreen?.append(wrapper);

    requestAnimationFrame(() => {
        wrapper.classList.add('open');
    });
}

export function closeSideMenu() {
    const wrapper = document.getElementById('side-menu-wrapper');
    if (!wrapper) return;

    const blackout: HTMLButtonElement | any = document.getElementById('menu-blackout')
    if (!blackout) return;

    blackout.remove()
    blackout.disabled = true

    wrapper.classList.remove('open');
    wrapper.classList.add('closing');

    const onEnd = (event: TransitionEvent) => {
        if (event.target !== wrapper) return;
        wrapper.removeEventListener('transitionend', onEnd);
        wrapper.remove();
    };

    wrapper.addEventListener('transitionend', onEnd);
}
