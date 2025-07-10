import { deleteContact, fetchGroups } from '../api/groupsApi.js';
import { ActionBtn } from '../components/ActionBtn.js';
import { showConfirmationModal } from '../components/showConfirmationModal.js';
import { formatPhone } from '../utils/formatPhone.js';
import { createContactMenu } from './createContactMenu.js';
import { openSideMenu } from './menuManager.js';

export async function renderContactsList(): Promise<HTMLElement> {
    const list = document.createElement('ul');
    list.className = 'contacts-list';

    const mainScreenWrapper = document.createElement('div');
    mainScreenWrapper.className = 'main-screen-wrapper'

    const secondBtn: any = document.getElementById('open-create2');
    console.log('secondBtn', secondBtn)

    try {
        const groups = await fetchGroups();
        if (groups.length === 0) {
            const emptyNotice = document.createElement("div");
            emptyNotice.textContent = 'Список контактов пуст';
            emptyNotice.className = 'main-empty-notice';
            return emptyNotice;
        }

        for (const group of groups) {
            const li = document.createElement('li');
            li.className = 'group-accordeon';

            const wrapper = document.createElement('div');
            wrapper.className = 'accordeon-wrapper';
            wrapper.id = 'accordeon-wrapper'

            const header = document.createElement('div');
            header.className = 'group-header';
            header.textContent = group.name;

            const contacts = document.createElement('div');
            contacts.className = 'contacts-container';

            if (group.contacts.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'no-contacts';
                empty.textContent = 'Нет контактов';
                contacts.appendChild(empty);
            } else {
                group.contacts.forEach(contact => {
                    const row = document.createElement('div');
                    row.className = 'contacts-row';

                    const name = document.createElement('span');
                    name.className = 'contacts-name';
                    name.textContent = contact.name;

                    const contactRowUiWrapper = document.createElement('div');
                    contactRowUiWrapper.className = 'contacts-row-ui-wrapper';

                    const phone = document.createElement('span');
                    phone.className = 'contacts-phone';
                    phone.textContent = formatPhone(contact.phone);

                    const change = ActionBtn('change', async () => {
                        const form = await createContactMenu(contact, group.id);
                        openSideMenu(form);
                    });

                    const remove = ActionBtn('delete', () => {
                        showConfirmationModal(
                            `Удалить контакт «${contact.name}»?`,
                            'Контакт будет безвозвратно удалён из этой группы. Это действие нельзя отменить.',
                            async () => {
                                try {
                                    await deleteContact(group.id, contact.id);
                                    row.remove();
                                    if (!contacts.querySelector('.contacts-row')) {
                                        const empty = document.createElement('div');
                                        empty.className = 'no-contacts';
                                        empty.textContent = 'Нет контактов';
                                        contacts.appendChild(empty);
                                    }
                                } catch (e) {
                                    console.error('Ошибка при удалении контакта:', e);
                                    alert('Не удалось удалить контакт');
                                }
                            }
                        );
                    });

                    contactRowUiWrapper.append(phone, change, remove)

                    row.append(name, contactRowUiWrapper);
                    contacts.appendChild(row);
                });
            }

            header.onclick = () => {
                contacts.classList.toggle('open');
                header.classList.toggle('open');
                wrapper.classList.toggle('open');
            };

            wrapper.append(header, contacts);
            li.appendChild(wrapper);
            list.appendChild(li);
        }

    } catch (err) {
        console.error('Ошибка загрузки групп:', err);
        list.textContent = 'Не удалось загрузить контакты';
    }

    mainScreenWrapper.append(secondBtn, list)

    return mainScreenWrapper;
}
