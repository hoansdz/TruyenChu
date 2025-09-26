import storyCategory from "./backend/story_category.js";

const selectingCategory = new Set();
let selectingImage;

function addCategorySelecting(parent, categoryId, categoryName) {
    const div = document.createElement('div');
    const p = document.createElement('p');
    const close = document.createElement('img');
    p.textContent = categoryName;
    close.src = 'images/close.png';
    div.appendChild(p);
    div.appendChild(close);
    div.style.display = 'none';
    close.addEventListener('click', () => {
        selectingCategory.delete(categoryId);
        div.style.display = 'none';
    });
    parent.appendChild(div);
}

function addCategory(parent, selectingCategoryBox, categoryId, categoryName) {
    const div = document.createElement('div');
    const p = document.createElement('p');
    const checkbox = document.createElement('input');
    p.textContent = categoryName;
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            selectingCategory.add(categoryId);
            selectingCategoryBox.children[categoryId].style.display = 'flex';
        } else {
            selectingCategory.delete(categoryId);
            selectingCategoryBox.children[categoryId].style.display = 'none';
        }
    });
    div.appendChild(checkbox);
    div.appendChild(p);
    div.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
            if (checkbox.checked) {
                selectingCategory.add(categoryId);
                selectingCategoryBox.children[categoryId].style.display = 'flex';
            } else {
                selectingCategory.delete(categoryId);
                selectingCategoryBox.children[categoryId].style.display = 'none';
            }
        }
    });
    parent.appendChild(div);
}

function loadDropbox() {
    const selectingDropbox = document.getElementById('ct-selecting-category');
    const searchDropbox = document.getElementById('ct-search-category');
    const categoryDropboxMenu = document.getElementById('ct-select-category-menu');
    const openDropbox = document.getElementById('ct-open-dropbox');
    const selectingCategoryBox = document.getElementById('ct-selecting-category-box');
    for (const [categoryId, categoryName] of Object.entries(storyCategory)) {
        addCategorySelecting(selectingCategoryBox, categoryId, categoryName);
        addCategory(categoryDropboxMenu, selectingCategoryBox, categoryId, categoryName);
    }
    searchDropbox.addEventListener('focus', () => {
        setTimeout(() => {
            openDropbox.classList.add('rotate');
            categoryDropboxMenu.style.display = 'block';
        }, 10);
    });
    searchDropbox.addEventListener('input', (e) => {
        setTimeout(() => {
            for (let i = 0; i < categoryDropboxMenu.children.length; ++i) {
                const child = categoryDropboxMenu.children[i];
                if (child.tagName != 'DIV') continue;
                for (let i = 0; i < child.children.length; ++i) {
                    const p = child.children[i];
                    if (p.tagName != 'P') continue;
                    child.style.display = p.textContent.toLowerCase().includes(e.target.value.toLowerCase()) ? 'flex' : 'none';
                }
            }
        }, 5);
    });
    openDropbox.addEventListener('click', () => {
        if (openDropbox.classList.contains('rotate')) {
            openDropbox.classList.remove('rotate');
            categoryDropboxMenu.style.display = 'none';
        } else {
            openDropbox.classList.add('rotate');
            categoryDropboxMenu.style.display = 'block';
        }
    });
    document.addEventListener('click', (e) => {
        if (!selectingDropbox.contains(e.target) && !categoryDropboxMenu.contains(e.target)) {
            openDropbox.classList.remove('rotate');
            categoryDropboxMenu.style.display = 'none';
        }
    });
}

async function onPageLoaded() {
    const inputName = document.getElementById('ct-input-name');
    const nameError = document.getElementById('ct-name-error');
    const inputDescription = document.getElementById('ct-input-decription');
    const image = document.getElementById('ct-image');
    const imageBox = document.getElementById('ct-image-box');
    const inputImage = document.getElementById('ct-input-image');
    const imageError = document.getElementById('ct-image-error');
    const inputAuthorName = document.getElementById('ct-input-author-name');
    const categoryError = document.getElementById('ct-category-error');
    const createStory = document.getElementById('ct-create-story');

    window.appState.users(() => {
        if (!window.appState.users.isSigned) {
            window.location.href = 'login.html';
            return;
        }
        inputAuthorName.value = window.appState.users.data.name;
        createStory.addEventListener('click', async () => {
            let nameErrorMessage = '';
            if (inputName.value.length == 0) {
                nameErrorMessage = 'Tên truyện không được để trống';
            }
            nameError.textContent = nameErrorMessage;
            let categoryErrorMessage = '';
            if (selectingCategory.size == 0) {
                categoryErrorMessage = 'Vui lòng chọn ít nhất 1 thể loại';
            }
            categoryError.textContent = categoryErrorMessage;
            let imageErrorMessage = '';
            if (!selectingImage) {
                imageErrorMessage = 'Vui lòng chọn hình ảnh';
            }
            imageError.textContent = imageErrorMessage;
            if (nameErrorMessage || categoryErrorMessage || imageErrorMessage) return;
            const formData = new FormData();
            formData.append('image', selectingImage);
            formData.append('body', JSON.stringify({
                name: inputName.value,
                author_name: inputAuthorName.value,
                description: inputDescription.value,
                story_category: Array.from(selectingCategory)
            }));
            const res = await fetch('https://cjjyrcdasvkchicimbjv.supabase.co/functions/v1/createStory', {
                method: 'POST',
                headers: { Authorization: `Bearer ${window.appState.users.data.session}` },
                body: formData,
            });
            const { state, message } = await res.json();
            if (state === 'fail') {
                alert(message);
                return;
            }
            window.location.href = 'index.html';
        });
    });

    loadDropbox();

    inputImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        selectingImage = file;
        const url = URL.createObjectURL(file);
        image.style.display = 'none';
        imageBox.style.backgroundImage = `url('${url}')`;
        imageBox.style.backgroundSize = 'cover';
        imageBox.style.backgroundPosition = 'center';
    });
}

export default onPageLoaded;