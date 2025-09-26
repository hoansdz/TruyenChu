import supabase from "./supabase.js";
import storyCategory from "./backend/story_category.js"

function isoStringToReadableString(isoString) {
    return new Date(isoString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).replace('lúc', '');
}

function timeAgo(date) {
  const now = new Date();
  const delta = Math.floor((now - date) / 1000); // chênh lệch tính bằng giây

  if (delta < 60) {
    return `${delta} giây trước`;
  } else if (delta < 3600) {
    const minutes = Math.floor(delta / 60);
    return `${minutes} phút trước`;
  } else if (delta < 86400) {
    const hours = Math.floor(delta / 3600);
    return `${hours} giờ trước`;
  } else {
    const days = Math.floor(delta / 86400);
    return `${days} ngày trước`;
  }
}

function addStoryCategory(parent, categoryId) {
  const categoryString = storyCategory[categoryId];
  const p = document.createElement('p');
  p.textContent = categoryString;
  parent.appendChild(p);
}

async function onPageLoaded() {
    const storyData = localStorage.getItem('loading_story');
    const story = JSON.parse(storyData);
    supabase.functions.invoke('getUserInformation', {
      body: {
        userId: story.upload_by
      }
    }).then(({data: {userData}, error}) => {
      uploadBy.textContent = userData.name;
    });
    supabase.functions.invoke('getChapters', {
      body: {
        story_id: story.id,
        offset: 0,
        limit: 10
      }
    }).then(({data: {chapters}, state}) => {
      if (state === 'fail' || chapters.length === 0) {
        return;
      }
      const chapterArea = document.getElementById('chapter-area');
      for (const element of document.getElementsByClassName('none')) {
        element.style.display = 'none';
      }
      chapters.forEach((chapter) => {
        const p1 = document.createElement('p');
        const p2 = document.createElement('p');
        p1.textContent = `${chapter.id}. ${chapter.title}`;
        p2.textContent = isoStringToReadableString(chapter.created_at);
        p1.addEventListener('click', () => {
          localStorage.setItem('loading_chapter', JSON.stringify({
            storyId: story.id,
            chapterId: chapter.index
          }));
          window.appState.onNewPage('read-chapter');
        });
        chapterArea.appendChild(p1);
        chapterArea.appendChild(p2);
      });
    });
    const image = document.getElementById('image');
    const name = document.getElementById('story-name');
    const description = document.getElementById('story-decription');
    const createdAt = document.getElementById('story-created-at');
    const authorName = document.getElementById('story-author-name');
    const lastUpdate = document.getElementById('story-last-update');
    const uploadBy = document.getElementById('story-update-by');
    const category = document.getElementById('list-category');
    console.log(story);
    image.src = `${story.image_url}?t=${Date.now()}`
    name.textContent = story.name;
    description.innerText = story.description;
    createdAt.textContent = isoStringToReadableString(story.created_at);
    authorName.textContent = story.author_name;
    lastUpdate.textContent = timeAgo(new Date(story.last_update));
    for (const storyId of story.story_category) {
      addStoryCategory(category, storyId);
    }
}

export default onPageLoaded;