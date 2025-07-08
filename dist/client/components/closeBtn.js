export function CloseBtn(onClick, className = 'close-btn') {
    const btn = document.createElement('button');
    if (onClick) {
        btn.onclick = onClick;
    }
    btn.className = className;
    btn.type = "button";
    return btn;
}
