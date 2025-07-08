export function Btn(
    text: string,
    onClick?: (e: MouseEvent) => void,
    className?: string,
    submit = false,
): HTMLButtonElement {
    const btn = document.createElement('button');
    if (className) {
        btn.className = className + "btn";
    } else {
        btn.className = "btn"
    }

    if (onClick) {
        btn.onclick = onClick;
    }

    if (submit) {
        btn.type = 'submit';
    }

    btn.textContent = text

    return btn;
}
