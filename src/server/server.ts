import http, { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs/promises';
import path from 'path';
import { URL } from 'url';

interface Contact {
    id: number;
    name: string;
    phone: string;
}

interface Group {
    id: number;
    name: string;
    contacts: Contact[];
}

interface DB {
    groups: Group[];
}

const DB_PATH = path.resolve('./db.json');
let db: DB;

async function loadDB() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        db = JSON.parse(data);
    } catch (e) {
        console.error('Failed to load DB:', e);
        db = { groups: [] };
    }
}

async function saveDB() {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

// Utility to read JSON body
async function getRequestBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error('Invalid JSON'));
            }
        });
    });
}

function sendJSON(res: ServerResponse, data: any, status = 200) {
    const json = JSON.stringify(data);
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(json),
        'Access-Control-Allow-Origin': '*', // CORS for dev
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(json);
}

function sendError(res: ServerResponse, status: number, message: string) {
    sendJSON(res, { error: message }, status);
}

// Simple id generator: find max existing id + 1
function nextId<T extends { id: number }>(items: T[]): number {
    return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

// Handle OPTIONS preflight CORS requests
function handleOptions(req: IncomingMessage, res: ServerResponse) {
    res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
}

// Main server logic
async function requestListener(req: IncomingMessage, res: ServerResponse) {
    if (req.method === 'OPTIONS') return handleOptions(req, res);

    const parsedUrl = new URL(req.url ?? '', `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method ?? 'GET';

    // Route matching:
    // /groups
    if (pathname === '/groups') {
        if (method === 'GET') {
            return sendJSON(res, db.groups);
        }
        if (method === 'POST') {
            try {
                const body = await getRequestBody(req);
                if (!body.name) return sendError(res, 400, 'Missing group name');

                const newGroup: Group = {
                    id: nextId(db.groups),
                    name: body.name,
                    contacts: [],
                };
                db.groups.push(newGroup);
                await saveDB();
                return sendJSON(res, newGroup, 201);
            } catch (err) {
                return sendError(res, 400, 'Invalid JSON');
            }
        }
    }

    // /groups/:groupId
    const groupMatch = pathname.match(/^\/groups\/(\d+)$/);
    if (groupMatch) {
        const groupId = Number(groupMatch[1]);
        const group = db.groups.find(g => g.id === groupId);
        if (!group) return sendError(res, 404, 'Group not found');

        if (method === 'GET') {
            return sendJSON(res, group);
        }
        if (method === 'PUT') {
            try {
                const body = await getRequestBody(req);
                if (!body.name) return sendError(res, 400, 'Missing group name');
                group.name = body.name;
                await saveDB();
                return sendJSON(res, group);
            } catch {
                return sendError(res, 400, 'Invalid JSON');
            }
        }
        if (method === 'DELETE') {
            db.groups = db.groups.filter(g => g.id !== groupId);
            await saveDB();
            return sendJSON(res, { message: 'Deleted' });
        }
    }

    // /groups/:groupId/contacts
    const contactsMatch = pathname.match(/^\/groups\/(\d+)\/contacts$/);
    if (contactsMatch) {
        const groupId = Number(contactsMatch[1]);
        const group = db.groups.find(g => g.id === groupId);
        if (!group) return sendError(res, 404, 'Group not found');

        if (method === 'GET') {
            return sendJSON(res, group.contacts);
        }
        if (method === 'POST') {
            try {
                const body = await getRequestBody(req);
                if (!body.name || !body.phone) {
                    return sendError(res, 400, 'Missing contact name or phone');
                }
                const newContact: Contact = {
                    id: nextId(group.contacts),
                    name: body.name,
                    phone: body.phone,
                };
                group.contacts.push(newContact);
                await saveDB();
                return sendJSON(res, newContact, 201);
            } catch {
                return sendError(res, 400, 'Invalid JSON');
            }
        }
    }

    // /groups/:groupId/contacts/:contactId
    const contactMatch = pathname.match(/^\/groups\/(\d+)\/contacts\/(\d+)$/);
    if (contactMatch) {
        const groupId = Number(contactMatch[1]);
        const contactId = Number(contactMatch[2]);
        const group = db.groups.find(g => g.id === groupId);
        if (!group) return sendError(res, 404, 'Group not found');
        const contact = group.contacts.find(c => c.id === contactId);
        if (!contact) return sendError(res, 404, 'Contact not found');

        if (method === 'GET') {
            return sendJSON(res, contact);
        }
        if (method === 'PUT') {
            try {
                const body = await getRequestBody(req);
                if (!body.name || !body.phone) {
                    return sendError(res, 400, 'Missing contact name or phone');
                }
                contact.name = body.name;
                contact.phone = body.phone;
                await saveDB();
                return sendJSON(res, contact);
            } catch {
                return sendError(res, 400, 'Invalid JSON');
            }
        }
        if (method === 'DELETE') {
            group.contacts = group.contacts.filter(c => c.id !== contactId);
            await saveDB();
            return sendJSON(res, { message: 'Deleted' });
        }
    }

    // If nothing matched:
    sendError(res, 404, 'Not found');
}

async function startServer() {
    await loadDB();
    const server = http.createServer(requestListener);
    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

startServer();
