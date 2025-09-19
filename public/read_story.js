import users from "./backend/users.js";
import supabase from "./supabase.js";

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

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const {data: {story}} = await supabase.functions.invoke('getStory', {
        body: {
            id: id
        }
    });
    const name = document.getElementById('story-name');
    const description = document.getElementById('story-decription');
    const createdAt = document.getElementById('story-created-at');
    const authorName = document.getElementById('story-author-name');
    const lastUpdate = document.getElementById('story-last-update');
    const uploadBy = document.getElementById('story-update-by');
    const category = document.getElementById('story-category');
    console.log(story);
    name.textContent = story.name;
    description.textContent = story.description;
    createdAt.textContent = isoStringToReadableString(story.created_at);
    authorName.textContent = story.author_name;
    lastUpdate.textContent = timeAgo(new Date(story.last_update));
    uploadBy.textContent = 'Đố biết đấy!';
    category.textContent = 'Đố biết đấy!';
});