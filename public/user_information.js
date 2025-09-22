import supabase from "./supabase.js";
import users from "./backend/users.js";

var selectingStory = null;
let creatingChapter = false;

function addStory(parent, storyOptionMenu, story) {
    const main = document.createElement('div');
    const div1 = document.createElement('div');
    const checkbox = document.createElement('input');
    const p = document.createElement('p');
    const img = document.createElement('img');
    main.classList.add('story');
    checkbox.type = 'checkbox';
    p.textContent = story.name;
    div1.appendChild(checkbox);
    div1.appendChild(p);
    img.src = 'images/dots.png'
    img.addEventListener('click', () => {
        if (getComputedStyle(storyOptionMenu).display !== 'none') {
            storyOptionMenu.style.display = 'none';
            selectingStory = null;
            return;
        }
        selectingStory = story;
        storyOptionMenu.style.display = 'flex';
        const menuRect = storyOptionMenu.getBoundingClientRect();
        const rect = img.getBoundingClientRect();
        storyOptionMenu.style.top = (rect.bottom + 6 + window.scrollY) + 'px';
        storyOptionMenu.style.left = `${rect.right + window.scrollX - menuRect.width}px`;
    });
    main.appendChild(div1);
    main.appendChild(img);
    parent.appendChild(main);
}

function loadChapterDialog(dialog) {
    const content = document.getElementById('chapter-menu-content');
    const cancel = document.getElementById('chapter-menu-cancel');
    const add = document.getElementById('chapter-menu-add');
    const chapterTitle = document.getElementById('chapter-title');
    const chapterTextContent = document.getElementById('chapter-text-content');
    const chapterTextContentError = document.getElementById('chapter-text-content-error');
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.style.display = 'none';
        }
    });
    cancel.addEventListener('click', () => {
        dialog.style.display = 'none';
    });
    add.addEventListener('click', async () => {
        if (creatingChapter) return;
        creatingChapter = true;
        const title = chapterTitle.value;
        const textContent = chapterTextContent.value;
        const {data: {chapterId}, error} = await supabase.functions.invoke('createChapter', {
            body: {
                story_id: selectingStory.id,
                text_content: textContent,
                title: title
            }
        });
        creatingChapter = false;
        if (error) {
            alert(error);
            return;
        }
        dialog.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const avatar = document.getElementById('avatar');
    const inputAvatar = document.getElementById('input-avatar');
    const stories = document.getElementById('stories');
    const emptyStory = document.getElementById('empty-story');
    const storyOptionMenu = document.getElementById('story-option-menu');
    users(async () => {
        if (!users.isSigned) {
            window.location.href = 'login.html';
            return;
        }
        console.log(users.data);
        document.getElementById('user-created-at').textContent = isoStringToReadableString(users.data.created_at);
        document.getElementById('user-name').textContent = users.data.name;
        document.getElementById('user-email').textContent = users.email;
        if (users.data.avatar_url !== null) {
            document.getElementById('avatar').src = users.data.avatar_url + `?t=${Date.now()}`;
        }
        if (users.data.stories.length !== 0) {
            emptyStory.style.display = 'none';
        }
        users.data.stories.forEach(id => {
            supabase.functions.invoke('getStory', {
                body: {
                    id: id
                }
            }).then(({ data: { story }, error }) => {
                if (error) {
                    return;
                }
                
                addStory(stories, storyOptionMenu, story);
            });
        });
    });
    const addChapterOption = document.getElementById('add-chapter-option');
    const addChapterDialog = document.getElementById('add-chapter-menu');
    loadChapterDialog(addChapterDialog);
    addChapterOption.addEventListener('click', () => {
        addChapterDialog.style.display = 'flex';
        storyOptionMenu.style.display = 'none';
    });
    inputAvatar.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        console.log(e.target.files)
        if (!file || !users.isSigned) return;
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            console.log(`Bearer ${users.session}`);
            const res = await fetch('https://cjjyrcdasvkchicimbjv.supabase.co/functions/v1/updateAvatar', {
                method: 'POST',
                headers: { Authorization: `Bearer ${users.session}` },
                body: formData
            });
            const { state, message, url } = await res.json();
            if (state !== 'success') {
                alert(message ?? 'Ưtf');
                return;
            }

            avatar.src = url + `?t=${Date.now()}`;
        }
    });
});

function isoStringToReadableString(isoString) {
    return new Date(isoString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).replace('lúc', 'Lúc');
}