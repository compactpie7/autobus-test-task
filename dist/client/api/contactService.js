// api/contactService.ts
import { fetchGroups } from './groupsApi.js';
export async function moveContactToGroup(contactId, oldGroupId, newGroupId) {
    const groups = await fetchGroups();
    const oldGroup = groups.find(g => g.id === oldGroupId);
    const newGroup = groups.find(g => g.id === newGroupId);
    if (!oldGroup || !newGroup)
        throw new Error('Group not found');
    const contactIndex = oldGroup.contacts.findIndex(c => c.id === contactId);
    if (contactIndex === -1)
        throw new Error('Contact not found in old group');
    const contact = oldGroup.contacts[contactIndex];
    oldGroup.contacts.splice(contactIndex, 1);
    contact.id = newGroup.contacts.length ? Math.max(...newGroup.contacts.map(c => c.id)) + 1 : 1;
    newGroup.contacts.push(contact);
    await fetch('http://localhost:3000/groups/' + oldGroupId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(oldGroup)
    });
    await fetch('http://localhost:3000/groups/' + newGroupId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup)
    });
}
