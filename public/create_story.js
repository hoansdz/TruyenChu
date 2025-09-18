import storyCategory from "./backend/story_category.js";

const selectingCategory = new Set();

function addCategorySelecting(parent, categoryId, categoryName) {
    const div = document.createElement('div');
    const p = document.createElement('p');
    const close = document.createElement('img');
    p.innerHTML = categoryName;
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
    p.innerHTML = categoryName;
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

document.addEventListener('DOMContentLoaded', () => {
    const image = document.getElementById('image');
    const imageBox = document.getElementById('image-box');
    const inputImage = document.getElementById('input-image');
    const selectingDropbox = document.getElementById('selecting-category');
    const searchDropbox = document.getElementById('search-category');
    const categoryDropboxMenu = document.getElementById('select-category-menu');
    const openDropbox = document.getElementById('open-dropbox');
    const selectingCategoryBox = document.getElementById('selecting-category-box');
    const createStory = document.getElementById('create-story');
    for (const [categoryId, categoryName] of Object.entries(storyCategory)) {
        addCategorySelecting(selectingCategoryBox, categoryId, categoryName);
        addCategory(categoryDropboxMenu, selectingCategoryBox, categoryId, categoryName);
    }
    inputImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        image.style.display = 'none';
        imageBox.style.backgroundImage = `url('${url}')`;
        imageBox.style.backgroundSize = 'cover';
        imageBox.style.backgroundPosition = 'center';
    });
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
                    child.style.display = p.innerHTML.toLowerCase().includes(e.target.value.toLowerCase()) ? 'flex' : 'none';
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
    createStory.addEventListener('click', () => {
        
    });
    document.addEventListener('click', (e) => {
        if (!selectingDropbox.contains(e.target) && !categoryDropboxMenu.contains(e.target)) {
            openDropbox.classList.remove('rotate');
            categoryDropboxMenu.style.display = 'none';
        }
    });
});