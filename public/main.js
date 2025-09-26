import supabase from './supabase.js';

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
        localStorage.setItem('loading_story', JSON.stringify(story));
        window.appState.onNewPage('story');
    });
}
async function onPageLoaded(state) {
    const emptyStory = document.getElementById('empty');
    const grid = document.getElementById('suggest-grid');
    const { data: { stories }, error: getStoriesError } = await supabase.functions.invoke('getStories', {
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
    emptyStory.style.display = 'none';
}

export default onPageLoaded;