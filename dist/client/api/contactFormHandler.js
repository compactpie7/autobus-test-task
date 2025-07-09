import { fetchGroups } from '../api/groupsApi.js';
import { closeSideMenu } from '../ui/menuManager.js';
export async function handleContactFormSubmit(e, contact, groupId, nameInput, phoneInput, selectedGroupName) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    if (!name || !phone || !selectedGroupName) {
        alert("Все поля обязательны");
        return;
    }
    try {
        const groups = await fetchGroups();
        const targetGroup = groups.find(g => g.name === selectedGroupName);
        if (!targetGroup)
            throw new Error("Группа не найдена");
        if (contact && groupId !== undefined) {
            const isMoving = targetGroup.id !== groupId;
            if (isMoving) {
                const created = await fetch(`http://localhost:3000/groups/${targetGroup.id}/contacts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone }),
                });
                if (!created.ok)
                    throw new Error('Не удалось создать контакт в новой группе');
                const deleted = await fetch(`http://localhost:3000/groups/${groupId}/contacts/${contact.id}`, {
                    method: 'DELETE',
                });
                if (!deleted.ok)
                    throw new Error('Не удалось удалить контакт из старой группы');
            }
            else {
                const updated = await fetch(`http://localhost:3000/groups/${groupId}/contacts/${contact.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone }),
                });
                if (!updated.ok)
                    throw new Error('Не удалось обновить контакт');
            }
        }
        else {
            const created = await fetch(`http://localhost:3000/groups/${targetGroup.id}/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone }),
            });
            if (!created.ok)
                throw new Error('Не удалось создать контакт');
        }
        closeSideMenu();
        location.reload();
    }
    catch (err) {
        console.error(err);
        alert(err.message || 'Произошла ошибка');
    }
}
