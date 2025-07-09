import { Contact, fetchGroups } from '../api/groupsApi.js';
import { closeSideMenu } from '../ui/menuManager.js';

export async function handleContactFormSubmit(
    e: Event,
    contact: Contact | undefined,
    groupId: number | undefined,
    nameInput: HTMLInputElement,
    phoneInput: HTMLInputElement,
    selectedGroupName: string
) {
    e.preventDefault();

    // Clear previous errors
    [nameInput, phoneInput].forEach(input => {
        input.classList.remove('error');
        const next = input.nextElementSibling;
        if (next && next.classList.contains('validation-error-message')) {
            next.remove();
        }
    });

    const selected = document.querySelector('.custom-dropdown');
    if (selected) {
        selected.classList.remove('error');
        const next = selected.nextElementSibling;
        if (next && next.classList.contains('validation-error-message')) {
            next.remove();
        }
    }

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    let hasError = false;

    if (!name) {
        nameInput.classList.add('error');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'validation-error-message';
        errorMsg.textContent = 'Поле является обязательным';
        nameInput.after(errorMsg);
        hasError = true;
    }

    if (!phone) {
        phoneInput.classList.add('error');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'validation-error-message';
        errorMsg.textContent = 'Поле является обязательным';
        phoneInput.after(errorMsg);
        hasError = true;
    }

    if (!selectedGroupName && selected) {
        selected.classList.add('error');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'validation-error-message';
        errorMsg.textContent = 'Поле является обязательным';
        if (!selected.nextElementSibling || !selected.nextElementSibling.classList.contains('validation-error-message')) {
            selected.after(errorMsg);
        }
        hasError = true;
    }

    if (hasError) return;

    // ✅ Proceed with API logic
    try {
        const groups = await fetchGroups();
        const targetGroup = groups.find(g => g.name === selectedGroupName);
        if (!targetGroup) throw new Error("Группа не найдена");

        if (contact && groupId !== undefined) {
            const isMoving = targetGroup.id !== groupId;

            if (isMoving) {
                const created = await fetch(`http://localhost:3000/groups/${targetGroup.id}/contacts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone }),
                });
                if (!created.ok) throw new Error('Не удалось создать контакт в новой группе');

                const deleted = await fetch(`http://localhost:3000/groups/${groupId}/contacts/${contact.id}`, {
                    method: 'DELETE',
                });
                if (!deleted.ok) throw new Error('Не удалось удалить контакт из старой группы');
            } else {
                const updated = await fetch(`http://localhost:3000/groups/${groupId}/contacts/${contact.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone }),
                });
                if (!updated.ok) throw new Error('Не удалось обновить контакт');
            }

        } else {
            const created = await fetch(`http://localhost:3000/groups/${targetGroup.id}/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone }),
            });
            if (!created.ok) throw new Error('Не удалось создать контакт');
        }

        closeSideMenu();
        location.reload();

    } catch (err) {
        console.error(err);
        alert((err as Error).message || 'Произошла ошибка');
    }
}
