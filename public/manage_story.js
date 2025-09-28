import supabase from './supabase.js';

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
    div1.addEventListener('click', (e) => {
        if (e.target === checkbox) return;
        checkbox.checked = !checkbox.checked;
    });
    div1.appendChild(checkbox);
    div1.appendChild(p);
    img.src = 'images/dots.png';
    img.classList.add('circle-hover');
    img.addEventListener('click', () => {
        if (storyOptionMenu.style.display === 'flex') {
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

async function onPageLoaded(state) {
    const myStoriesArea = document.getElementById('my-stories-area');
    const addChapterOption = document.getElementById('add-chapter-option');
    const addChapterDialog = document.getElementById('add-chapter-menu');
    const storyOptionMenu = document.getElementById('story-option-menu');
    loadChapterDialog(addChapterDialog);
    window.appState.users(async () => {
        if (!window.appState.users.isSigned) {
            window.appState.onNewPage('home');
            return;
        }
        console.log(window.appState.users.data.stories)
        window.appState.users.data.stories.forEach(id => {
            supabase.functions.invoke('getStory', {
                body: {
                    id: id
                }
            }).then(({ data: { story }, error }) => {
                if (error) {
                    return;
                }
                
                addStory(myStoriesArea, storyOptionMenu, story);
            });
        });
    }, (cache) => {
        if (!window.appState.users.isSigned) {
            window.appState.onNewPage('home');
            return;
        }
    });
    addChapterOption.addEventListener('click', () => {
        addChapterDialog.style.display = 'flex';
        storyOptionMenu.style.display = 'none';
    });
}

export default onPageLoaded;