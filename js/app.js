//get elements
const itemList = document.querySelector('.items');
const httpForm = document.getElementById('httpForm');
const itemInput = document.getElementById('itemInput');
const imageInput = document.getElementById('imageInput');
const feedback = document.querySelector('.feedback');
const submitBtn = document.getElementById('submitBtn');
let editedItemID = 0;
let edited = false;

const url = 'https://5ee0f59c30deff0016c3f94d.mockapi.io/items';

document.addEventListener('DOMContentLoaded', function () {
    getItemsAPI();
});

// submit
httpForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let itemName = itemInput.value;
    let imageName = imageInput.value;

    if (itemName.length === 0 || imageName.length === 0) {
        showFeedBack('please fillup the form!', 'danger');
    } else {
        if (edited === true) {
            updateItemAPI(itemName, imageName);
            submitBtn.textContent = 'Add Item';
            edited = false;
            getItemsAPI();
            console.log(edited);
        } else {
            postItemAPI(itemName, imageName);
            getItemsAPI();
        }
        getItemsAPI();
        itemInput.value = '';
        imageInput.value = '';
        itemInput.focus();
        showFeedBack('Item Sucessfully Added', 'success');
    }
});

// add Item
function postItemAPI(itemName, imageName) {
    const avatar = imageName;
    const name = itemName;

    const url = 'https://5ee0f59c30deff0016c3f94d.mockapi.io/items';

    const ajax = new XMLHttpRequest();

    ajax.open('POST', url, true);

    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    ajax.onerror = function () {
        console.log(`Error Found`);
    };

    ajax.send(`avatar=${avatar}&name=${name}`);
}

// Edit Item
function updateItemAPI(itemName, imageName) {
    // itemList.removeChild(editedParent);

    const avatar = imageName;
    const name = itemName;

    const url = `https://5ee0f59c30deff0016c3f94d.mockapi.io/items/${editedItemID}`;

    const ajax = new XMLHttpRequest();

    ajax.open('PUT', url, true);

    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    ajax.onerror = function () {
        console.log(`Error Found`);
    };

    ajax.send(`avatar=${avatar}&name=${name}`);
    getItemsAPI();
}

// ShowFeedback
function showFeedBack(message, alert) {
    feedback.classList.add(`showItem`, `alert-${alert}`);
    feedback.textContent = `${message}`;

    setTimeout(() => {
        feedback.classList.remove(`showItem`, `alert-${alert}`);
        feedback.textContent = ``;
    }, 2000);
}

// get Items API
function getItemsAPI() {
    const url = 'https://5ee0f59c30deff0016c3f94d.mockapi.io/items';

    const ajax = new XMLHttpRequest();

    ajax.open('GET', url, true);

    ajax.onload = function () {
        if (this.status === 200) {
            const items = JSON.parse(this.responseText);
            // console.log(items);
            showItems(items);
            handleClick();
        } else {
            this.onerror();
        }
    };

    ajax.onerror = function () {
        console.log(`Error Found`);
    };

    ajax.send();
}

function showItems(items) {
    let info = '';

    items.forEach((item) => {
        info += `
        <li
        class="list-group-item d-flex align-items-center justify-content-between flex-wrap item my-2"
    >
        <img
            src="img/${item.avatar}.jpeg"
            id="itemImage"
            class="itemImage img-thumbnail"
            alt="${item.name}"
        />
        <h6
            id="itemName"
            class="text-capitalize itemName"
        >
            ${item.name}
        </h6>
        <div class="icons">
            <a
                href="#"
                class="itemIcon mx-2 edit-icon"
                data-id="${item.id}"
            >
                <i class="fas fa-edit"></i>
            </a>
            <a
                href="#"
                class="itemIcon mx-2 delete-icon"
                data-id="${item.id}"
            >
                <i class="fas fa-trash"></i>
            </a>
        </div>
    </li>
        `;
    });

    itemList.innerHTML = info;
}

function handleClick() {
    const editIcon = document.querySelectorAll('.edit-icon');
    const deleteIcon = document.querySelectorAll('.delete-icon');

    deleteIcon.forEach((item) => {
        let itemID = item.dataset.id;
        item.addEventListener('click', function (e) {
            e.preventDefault();
            deleteItemAPI(itemID);
        });
    });

    editIcon.forEach((item) => {
        let itemID = item.dataset.id;
        item.addEventListener('click', function (e) {
            e.preventDefault();

            editedItemID = itemID;

            const parent = e.target.parentElement.parentElement.parentElement;

            edited = true;

            const image = parent.querySelector('.itemImage').src;
            const name = parent.querySelector('.itemName').textContent;

            itemInput.value = name.trim();
            imageInput.value = name.trim();

            submitBtn.textContent = 'Edit Item';

            console.log(parent, itemID, name);
        });
    });
}

function deleteItemAPI(id) {
    const url = `https://5ee0f59c30deff0016c3f94d.mockapi.io/items/${id}`;
    const ajax = new XMLHttpRequest();
    ajax.open('DELETE', url, true);
    ajax.onload = function () {
        if (this.status === 200) {
            getItemsAPI();
        } else {
            this.onerror();
        }
    };
    ajax.onerror = function () {
        console.log(`Error Found`);
    };
    ajax.send();
}
