export function CloseBtn(
    onClick?: (e: MouseEvent) => void,
    className = 'close-btn',
): HTMLButtonElement {
    const btn = document.createElement('button');
    if (onClick) {
        btn.onclick = onClick;
    }
    btn.className = className;
    btn.type = "button"
    return btn;
}
