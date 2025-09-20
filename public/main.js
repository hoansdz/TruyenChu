import supabase from './supabase.js';
import users from './backend/users.js';

function addStory(parent, story) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const title = document.createElement('p');
    const evaluate = document.createElement('p');
    title.textContent = story.name;
    img.src = story.image_url;
    evaluate.textContent = `⭐ ${story.average_star} / 10`;
    div.appendChild(img);
    div.appendChild(title);
    div.appendChild(evaluate);
    parent.appendChild(div);
    div.addEventListener('click', () => {
        window.location.href = `read_story.html?id=${story.id}`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const avatar = document.getElementById('avatar');
    const optionsDropbox = document.getElementById('options-dropbox');
    users(async () => {
        if (!users.isSigned) {
            document.getElementById('login-promo').style.display = 'block';
            return;
        }
        const { data: { userData }, error } = await supabase.functions.invoke('getPrivateData', {
            body: {},
        });
        document.getElementById('user-coins').textContent = userData.coins ?? 0;
        if (users.data.avatar_url) {
            avatar.src = users.data.avatar_url + `?t=${Date.now()}`;
        }
        const grid = document.getElementById('suggest-grid');
        const { data: {stories}, error: getStoriesError} = await supabase.functions.invoke('getStories', {
            body: {
                offset: 0,
                limit: 20
            }
        });
        if (getStoriesError || !stories.length) {
            return;
        }
        for (const story of stories) {
            addStory(grid, story);
        }
        document.getElementById('empty').style.display = 'none';
    });
    avatar.addEventListener('click', () => {
        optionsDropbox.style.display = optionsDropbox.style.display === 'none' ? 'block' : 'none';
    });
});