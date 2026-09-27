const STORAGE_KEY = 'belanjakita-items';

const seedItems = [
  { id: crypto.randomUUID(), name: 'Susu segar', completed: false },
  { id: crypto.randomUUID(), name: 'Roti gandum', completed: true },
  { id: crypto.randomUUID(), name: 'Telur ayam', completed: false },
  { id: crypto.randomUUID(), name: 'Buah pisang', completed: false }
];

let items = readItems();
let activeFilter = 'all';
let editingId = null;

const form = document.querySelector('#item-form');
const input = document.querySelector('#item-input');
const listContainer = document.querySelector('#list-container');
const emptyState = document.querySelector('#empty-state');
const progressCount = document.querySelector('#progress-count');
const itemsLeft = document.querySelector('#items-left');
const clearCompletedButton = document.querySelector('#clear-completed');
const toast = document.querySelector('#toast');

function readItems() {
  try {
    const savedItems = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedItems) ? savedItems : seedItems;
  } catch {
    return seedItems;
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  })[character]);
}

function filteredItems() {
  if (activeFilter === 'active') return items.filter((item) => !item.completed);
  if (activeFilter === 'completed') return items.filter((item) => item.completed);
  return items;
}

function render() {
  const visibleItems = filteredItems();
  const completedCount = items.filter((item) => item.completed).length;
  const remainingCount = items.length - completedCount;

  progressCount.textContent = `${completedCount}/${items.length}`;
  itemsLeft.textContent = `${remainingCount} barang tersisa`;
  clearCompletedButton.disabled = completedCount === 0;
  listContainer.innerHTML = visibleItems.map(renderItem).join('');
  emptyState.classList.toggle('hidden', visibleItems.length > 0);

  document.querySelectorAll('.filter-btn').forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle('active', isActive);
    button.classList.toggle('bg-white', isActive);
    button.classList.toggle('text-moss', isActive);
    button.classList.toggle('shadow-sm', isActive);
    button.classList.toggle('text-ink/45', !isActive);
    button.setAttribute('aria-selected', String(isActive));
  });
}

function renderItem(item) {
  if (editingId === item.id) {
    return `<div class="item-row flex items-center gap-3 border-b border-ink/10 py-3" data-id="${item.id}">
      <input class="edit-input min-w-0 flex-1 rounded-lg border border-moss bg-paper px-3 py-2 text-sm outline-none ring-4 ring-moss/10" value="${escapeHtml(item.name)}" maxlength="80" aria-label="Edit nama barang">
      <button class="save-edit rounded-lg bg-moss px-3 py-2 text-xs font-bold text-white transition hover:bg-[#244a3f]" type="button">Simpan</button>
      <button class="cancel-edit rounded-lg px-2 py-2 text-xs font-bold text-ink/45 hover:text-ink" type="button">Batal</button>
    </div>`;
  }

  return `<div class="item-row ${item.completed ? 'is-completed' : ''} group flex items-center gap-3 border-b border-ink/10 py-3" data-id="${item.id}">
    <button class="check-button ${item.completed ? 'is-checked' : ''} grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-ink/20" type="button" aria-label="${item.completed ? 'Tandai belum dibeli' : 'Tandai sudah dibeli'}" title="${item.completed ? 'Tandai belum dibeli' : 'Tandai sudah dibeli'}">
      ${item.completed ? '<svg aria-hidden="true" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>' : ''}
    </button>
    <span class="item-name min-w-0 flex-1 truncate text-sm font-semibold">${escapeHtml(item.name)}</span>
    <div class="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
      <button class="edit-item rounded-lg p-2 text-ink/35 transition hover:bg-mint hover:text-moss" type="button" aria-label="Edit ${escapeHtml(item.name)}" title="Edit barang"><svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg></button>
      <button class="delete-item rounded-lg p-2 text-ink/35 transition hover:bg-red-50 hover:text-red-600" type="button" aria-label="Hapus ${escapeHtml(item.name)}" title="Hapus barang"><svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/></svg></button>
    </div>
  </div>`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('opacity-0', 'translate-y-3');
  toast.classList.add('opacity-100', 'translate-y-0');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-3');
    toast.classList.remove('opacity-100', 'translate-y-0');
  }, 2200);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }

  items.unshift({ id: crypto.randomUUID(), name, completed: false });
  saveItems();
  input.value = '';
  render();
  showToast('Barang ditambahkan');
});

document.addEventListener('click', (event) => {
  const filterButton = event.target.closest('.filter-btn');
  if (filterButton) {
    activeFilter = filterButton.dataset.filter;
    render();
    return;
  }

  const row = event.target.closest('[data-id]');
  if (!row) return;
  const item = items.find((entry) => entry.id === row.dataset.id);
  if (!item) return;

  if (event.target.closest('.check-button')) {
    item.completed = !item.completed;
    saveItems();
    render();
    showToast(item.completed ? 'Ditandai sudah dibeli' : 'Dikembalikan ke daftar');
  } else if (event.target.closest('.edit-item')) {
    editingId = item.id;
    render();
    row.querySelector('.edit-input')?.focus();
  } else if (event.target.closest('.delete-item')) {
    items = items.filter((entry) => entry.id !== item.id);
    saveItems();
    render();
    showToast('Barang dihapus');
  } else if (event.target.closest('.save-edit')) {
    const editInput = row.querySelector('.edit-input');
    const name = editInput.value.trim();
    if (!name) return;
    item.name = name;
    editingId = null;
    saveItems();
    render();
    showToast('Barang diperbarui');
  } else if (event.target.closest('.cancel-edit')) {
    editingId = null;
    render();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || !event.target.matches('.edit-input')) return;
  event.target.closest('[data-id]')?.querySelector('.save-edit')?.click();
});

clearCompletedButton.addEventListener('click', () => {
  const completedCount = items.filter((item) => item.completed).length;
  if (!completedCount) return;
  items = items.filter((item) => !item.completed);
  saveItems();
  render();
  showToast(`${completedCount} barang selesai dihapus`);
});

render();
