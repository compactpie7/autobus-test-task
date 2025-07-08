export function Btn(text, onClick, className, submit = false) {
    const btn = document.createElement('button');
    if (className) {
        btn.className = className;
    }
    else {
        btn.className = "btn";
    }
    if (onClick) {
        btn.onclick = onClick;
    }
    if (submit) {
        btn.type = 'submit';
    }
    btn.textContent = text;
    return btn;
}
