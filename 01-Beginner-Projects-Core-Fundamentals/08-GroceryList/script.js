const itemNameInput = document.getElementById('itemName');
const itemCategorySelect = document.getElementById('itemCategory');
const itemQuantityInput = document.getElementById('itemQuantity');
const btnCommit = document.getElementById('btnCommit');
const groceryGroups = document.getElementById('groceryGroups');
const emptyState = document.getElementById('emptyState');
const statusPercentage = document.getElementById('statusPercentage');
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const btnClearPurchased = document.getElementById('btnClearPurchased');
const filterTabs = document.querySelectorAll('.filter-tab');
const sortButtons = document.querySelectorAll('.sort-btn');
const btnThemeToggle = document.querySelector('.btn-theme-toggle');
const btnAddEntry = document.getElementById('btnAddEntry');

let items = [];
let currentFilter = 'all';
let currentSort = 'date';
let editingItemId = null;

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveItems() {
    localStorage.setItem('groceryItems', JSON.stringify(items));
}

function loadItems() {
    const savedItems = localStorage.getItem('groceryItems');
    if (savedItems) {
        items = JSON.parse(savedItems);
    } else {
        items = [];
    }
    renderItems();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('groceryTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeButton();
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('groceryTheme', isDark ? 'dark' : 'light');
    updateThemeButton();
}

function updateThemeButton() {
    const isDark = document.body.classList.contains('dark-mode');
    const icon = btnThemeToggle.querySelector('.material-symbols-outlined');
    const text = btnThemeToggle.querySelector('span:last-child');
    
    if (isDark) {
        icon.textContent = 'light_mode';
        text.textContent = 'Shift to Light';
    } else {
        icon.textContent = 'dark_mode';
        text.textContent = 'Shift to Dark';
    }
}

function updateStatus() {
    const total = items.length;
    const purchased = items.filter(item => item.purchased).length;
    const percentage = total > 0 ? Math.round((purchased / total) * 100) : 0;
    
    statusPercentage.textContent = percentage + '%';
    progressFill.style.width = percentage + '%';
    progressLabel.textContent = `Load Bearing: ${purchased} / ${total} Secured`;
}

function checkEmptyState() {
    const filteredItems = getFilteredItems();
    
    if (filteredItems.length === 0) {
        groceryGroups.style.display = 'none';
        emptyState.style.display = 'flex';
    } else {
        groceryGroups.style.display = 'flex';
        emptyState.style.display = 'none';
    }
}

function getFilteredItems() {
    let filtered = [...items];
    
    if (currentFilter === 'pending') {
        filtered = filtered.filter(item => !item.purchased);
    } else if (currentFilter === 'purchased') {
        filtered = filtered.filter(item => item.purchased);
    }
    
    return filtered;
}

function getSortedItems(itemsToSort) {
    let sorted = [...itemsToSort];
    
    if (currentSort === 'category') {
        sorted.sort((a, b) => a.category.localeCompare(b.category));
    } else if (currentSort === 'alphabetical') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'date') {
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return sorted;
}

function groupItemsByCategory(itemsToGroup) {
    const groups = {};
    
    itemsToGroup.forEach(item => {
        if (!groups[item.category]) {
            groups[item.category] = [];
        }
        groups[item.category].push(item);
    });
    
    return groups;
}

function createItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = `grocery-item${item.purchased ? ' grocery-item-purchased' : ''}`;
    itemDiv.dataset.id = item.id;
    
    const quantityText = item.quantity === 1 ? '1 Unit' : `${item.quantity} Units`;
    
    itemDiv.innerHTML = `
        <div class="grocery-item-left${item.purchased ? ' grocery-item-left-faded' : ''}">
            <div class="checkbox-box${item.purchased ? ' checkbox-checked' : ''}">
                ${item.purchased ? '<span class="material-symbols-outlined">check</span>' : ''}
            </div>
            <div class="grocery-item-info">
                <span class="grocery-item-name${item.purchased ? ' strikethrough' : ''}">${item.name}</span>
                <span class="grocery-item-qty">Quantity: ${quantityText}</span>
            </div>
        </div>
        <div class="grocery-item-actions">
            <button class="btn-action btn-action-edit">
                <span class="material-symbols-outlined icon-sm">edit</span>
            </button>
            <button class="btn-action btn-action-delete">
                <span class="material-symbols-outlined icon-sm">delete</span>
            </button>
        </div>
    `;
    
    return itemDiv;
}

function renderItems() {
    groceryGroups.innerHTML = '';
    
    const filteredItems = getFilteredItems();
    const sortedItems = getSortedItems(filteredItems);
    const groupedItems = groupItemsByCategory(sortedItems);
    
    const categories = Object.keys(groupedItems);
    
    categories.forEach((category, index) => {
        const categoryItems = groupedItems[category];
        const groupWrapper = document.createElement('div');
        groupWrapper.className = `group-wrapper${index > 0 ? ' group-wrapper-spaced' : ''}`;
        
        const tiltClass = index % 2 === 0 ? 'group-label-tilt-left' : 'group-label-tilt-right';
        
        groupWrapper.innerHTML = `
            <div class="group-label ${tiltClass}">${category} [${categoryItems.length.toString().padStart(2, '0')}]</div>
            <div class="group-container"></div>
        `;
        
        const groupContainer = groupWrapper.querySelector('.group-container');
        
        categoryItems.forEach(item => {
            const itemElement = createItemElement(item);
            groupContainer.appendChild(itemElement);
        });
        
        groceryGroups.appendChild(groupWrapper);
    });
    
    updateStatus();
    checkEmptyState();
    saveItems();
}

function addItem(name, category, quantity) {
    if (!name.trim()) {
        shakeElement(itemNameInput);
        return;
    }
    
    const newItem = {
        id: generateId(),
        name: name.trim(),
        category: category,
        quantity: parseInt(quantity) || 1,
        purchased: false,
        createdAt: new Date().toISOString()
    };
    
    items.unshift(newItem);
    renderItems();
    clearInputs();
}

function updateItem(id, name, category, quantity) {
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        items[itemIndex].name = name.trim();
        items[itemIndex].category = category;
        items[itemIndex].quantity = parseInt(quantity) || 1;
        renderItems();
    }
    
    editingItemId = null;
    btnCommit.textContent = 'Commit to List';
}

function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    renderItems();
}

function toggleItemPurchased(id) {
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        items[itemIndex].purchased = !items[itemIndex].purchased;
        renderItems();
    }
}

function editItem(id) {
    const item = items.find(item => item.id === id);
    
    if (item) {
        itemNameInput.value = item.name;
        itemCategorySelect.value = item.category;
        itemQuantityInput.value = item.quantity;
        
        editingItemId = id;
        btnCommit.textContent = 'Update Entry';
        
        itemNameInput.focus();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

function clearInputs() {
    itemNameInput.value = '';
    itemCategorySelect.value = 'Vegetables';
    itemQuantityInput.value = '1';
}

function clearPurchasedItems() {
    items = items.filter(item => !item.purchased);
    renderItems();
}

function setActiveFilter(filter) {
    filterTabs.forEach(tab => tab.classList.remove('filter-tab-active'));
    document.querySelector(`[data-filter="${filter}"]`).classList.add('filter-tab-active');
    currentFilter = filter;
    renderItems();
}

function setActiveSort(sort) {
    currentSort = sort;
    renderItems();
}

function shakeElement(element) {
    element.style.transition = 'transform 0.1s';
    element.style.transform = 'translateX(-5px)';
    
    setTimeout(() => {
        element.style.transform = 'translateX(5px)';
    }, 100);
    
    setTimeout(() => {
        element.style.transform = 'translateX(-5px)';
    }, 200);
    
    setTimeout(() => {
        element.style.transform = 'translateX(0)';
    }, 300);
}

btnCommit.addEventListener('click', function() {
    const name = itemNameInput.value;
    const category = itemCategorySelect.value;
    const quantity = itemQuantityInput.value;
    
    if (editingItemId) {
        updateItem(editingItemId, name, category, quantity);
    } else {
        addItem(name, category, quantity);
    }
});

itemNameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        btnCommit.click();
    }
});

groceryGroups.addEventListener('click', function(e) {
    const groceryItem = e.target.closest('.grocery-item');
    if (!groceryItem) return;
    
    const itemId = groceryItem.dataset.id;
    
    if (e.target.closest('.checkbox-box')) {
        toggleItemPurchased(itemId);
    }
    
    if (e.target.closest('.btn-action-delete')) {
        deleteItem(itemId);
    }
    
    if (e.target.closest('.btn-action-edit')) {
        editItem(itemId);
    }
});

filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const filter = this.dataset.filter;
        setActiveFilter(filter);
    });
});

sortButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const sort = this.dataset.sort;
        setActiveSort(sort);
    });
});

btnClearPurchased.addEventListener('click', clearPurchasedItems);

btnThemeToggle.addEventListener('click', toggleTheme);

if (btnAddEntry) {
    btnAddEntry.addEventListener('click', function() {
        itemNameInput.focus();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && editingItemId) {
        editingItemId = null;
        btnCommit.textContent = 'Commit to List';
        clearInputs();
    }
});

btnCommit.addEventListener('mousedown', function() {
    this.style.transform = 'translate(6px, 6px)';
    this.style.boxShadow = 'none';
});

btnCommit.addEventListener('mouseup', function() {
    this.style.transform = '';
    this.style.boxShadow = '';
});

btnCommit.addEventListener('mouseleave', function() {
    this.style.transform = '';
    this.style.boxShadow = '';
});

loadTheme();
loadItems();