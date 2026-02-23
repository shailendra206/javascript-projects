function returnLi() {
  return `<li class="grocery-item">
                <div class="item-content">
                    <input type="checkbox" class="item-checkbox" id="item_">
                    <label for="item1" class="item-text">${str}</label>
                </div>
                <div class="item-actions">
                    <button class="delete-btn" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </li>`;
}

const groceryInput = document.getElementById('groceryInput')
let str
groceryInput.addEventListener('input',()=>{
    str = groceryInput.value
})
const groceryList = document.querySelector('.grocery-list')
const addBtn = document.querySelector('.add-btn')
let updateItemCount = 0
const itemCount = document.getElementById('itemCount')

addBtn.addEventListener('click',()=>{
    groceryList.insertAdjacentHTML("afterbegin",returnLi());
    updateItemCount++
    itemCount.textContent = updateItemCount
    displayEmptyState()
    groceryInput.value = ""
})

const allGroceryList = document.querySelectorAll('.grocery-list')
const allChkBox = document.querySelectorAll('.item-checkbox')
const clearAllBtn = document.querySelector('.clear-all-btn')
const clearChkBtn = document.querySelector('.clear-checked-btn')
const emptyState = document.querySelector('.empty-state')
const deleteBtn = document.querySelectorAll('.delete-btn')

groceryList.addEventListener('click',(e)=>{
    const btn = e.target.closest('.delete-btn')
    if(!btn) return
    const li = btn.closest('.grocery-item');
    updateItemCount--
    itemCount.textContent = updateItemCount
    li.remove()
    displayEmptyState()
})

function displayEmptyState(){
    if(updateItemCount === 0){
        emptyState.style.display = "block";
    }else{
        emptyState.style.display = "none";
    }
}

clearAllBtn.addEventListener('click',()=>{
    clearAll()
})
clearChkBtn.addEventListener('click',()=>{
    clearChecked()
})

function clearAll(){
    const li = document.querySelectorAll('.grocery-item')
    li.forEach((item)=>{
        item.remove()
    })
    updateItemCount = 0
    itemCount.textContent = updateItemCount
    displayEmptyState()
}

function clearChecked(){
    const li = document.querySelectorAll('.grocery-item')
    li.forEach((item)=>{
        console.log(item)
        const checkbox = item.querySelector('.item-content .item-checkbox')
        console.log(checkbox)
        if(checkbox.checked){
            updateItemCount--
            itemCount.textContent = updateItemCount
            item.remove()
            displayEmptyState()
        }
    })
}


groceryList.addEventListener('click', (e) => {
    const checkbox = e.target.closest('.item-checkbox');
        if (checkbox) {
        const groceryItem = checkbox.closest('.grocery-item');
        
        // Toggle the 'checked' class based on checkbox state
        if (checkbox.checked) {
            groceryItem.classList.add('checked');  // ✅ Add class
        } else {
            groceryItem.classList.remove('checked');  // ❌ Remove class
        }
    }
});