// api/groupsApi.ts
const API_BASE = 'http://localhost:3000'; // Adjust as needed

export interface Group {
    id: number;
    name: string;
}

export async function fetchGroups(): Promise<Group[]> {
    const res = await fetch(`${API_BASE}/groups`);
    if (!res.ok) throw new Error('Failed to fetch groups');
    return res.json();
}

export async function updateGroup(id: number, name: string): Promise<void> {
    const res = await fetch(`${API_BASE}/groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to update group');
}

export async function deleteGroup(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/groups/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete group');
}

export async function createGroup(name: string): Promise<Group> {
    const res = await fetch(`${API_BASE}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contacts: [] }), // assuming backend wants empty contacts array
    });
    if (!res.ok) throw new Error('Failed to create group');
    return res.json();
}
