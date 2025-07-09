import { closeSideMenu } from './menuManager.js';
import { FormHeader } from '../components/FormHeader.js';
import { fetchGroups, updateGroup, deleteGroup, Group, createGroup } from '../api/groupsApi.js';
import { Btn } from '../components/Btn.js';
import { ActionBtn } from '../components/ActionBtn.js';

export function createGroupsMenu(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'group-side-menu side-menu';

    const formHeader = FormHeader("Группы контактов", closeSideMenu);
    const ul = document.createElement('ul');
    ul.id = 'groups-list';

    const newGroupContainer = document.createElement('div');
    newGroupContainer.className = 'groups-menu-confirm-form'

    const confirmAllChangesBtn = Btn("Сохранить", handleBulkSave, 'btn-transparent');
    confirmAllChangesBtn.style.marginTop = 'var(--main-padding)';
    confirmAllChangesBtn.style.display = 'none';

    let modifiedGroups = new Map<number, string>();

    let isAddingNewGroup = false;

    const addGroupBtn = Btn('Добавить группу', () => {
        if (isAddingNewGroup) return;

        isAddingNewGroup = true;
        addGroupBtn.style.display = 'none';
        newGroupContainer.innerHTML = '';
        newGroupContainer.style = "margin-top: auto;"


        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Введите название группы';
        input.className = 'side-menu-form-input';

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Создать';
        confirmBtn.className = 'btn';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Отмена';
        cancelBtn.className = 'btn-transparent';

        const groupsConfirmBtnGroup = document.createElement('div');
        groupsConfirmBtnGroup.className = 'groups-confirm-btn-group'
        groupsConfirmBtnGroup.append(confirmBtn, cancelBtn)

        newGroupContainer.append(input, groupsConfirmBtnGroup);
        input.focus();

        wrapper.append(newGroupContainer)

        confirmBtn.onclick = async () => {
            const groupName = input.value.trim();
            if (!groupName) {
                alert('Название группы не может быть пустым');
                input.focus();
                return;
            }
            try {
                await createGroup(groupName);
                await loadAndRenderGroups();
                newGroupContainer.innerHTML = '';
                isAddingNewGroup = false;
                addGroupBtn.style.display = 'inline-block';
            } catch (e) {
                alert('Ошибка при создании группы');
                console.error(e);
            }
        };

        cancelBtn.onclick = () => {
            newGroupContainer.remove()
            isAddingNewGroup = false;
            addGroupBtn.style.display = 'inline-block';
        };
    },
        'groups-btn btn'
    );

    wrapper.append(formHeader, ul, addGroupBtn, confirmAllChangesBtn);

    async function loadAndRenderGroups() {
        try {
            const groups = await fetchGroups();
            modifiedGroups.clear();
            confirmAllChangesBtn.style.display = 'none';
            renderGroups(groups);
        } catch (err) {
            ul.textContent = 'Ошибка загрузки групп';
            console.error(err);
        }
    }

    function renderGroups(groups: Group[]) {
        ul.innerHTML = '';

        groups.forEach(group => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.gap = '10px';

            const input = document.createElement('input');
            input.type = 'text';
            input.value = group.name;
            input.className = "side-menu-form-input";
            input.style.flexGrow = '1';

            input.addEventListener('input', () => {
                const newName = input.value.trim();
                if (newName && newName !== group.name) {
                    modifiedGroups.set(group.id, newName);
                } else {
                    modifiedGroups.delete(group.id);
                }
                confirmAllChangesBtn.style.display = modifiedGroups.size > 0 ? 'block' : 'none';
            });

            const deleteBtn = ActionBtn("delete", async () => {
                if (!confirm(`Удалить группу "${group.name}"?`)) return;
                try {
                    await deleteGroup(group.id);
                    await loadAndRenderGroups();
                } catch (e) {
                    alert('Ошибка при удалении');
                    console.error(e);
                }
            });
            deleteBtn.title = 'Удалить группу';

            li.append(input, deleteBtn);
            ul.appendChild(li);
        });
    }

    async function handleBulkSave() {
        if (modifiedGroups.size === 0) return;

        try {
            for (const [id, name] of modifiedGroups.entries()) {
                await updateGroup(id, name);
            }
            await loadAndRenderGroups();
        } catch (err) {
            alert('Ошибка при сохранении изменений');
            console.error(err);
        }
    }

    loadAndRenderGroups();
    return wrapper;
}
