import users from './backend/users.js';
import supabase from './supabase.js';

let story;
let chapter;

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const storyId = params.get('id');
    const chapterId = params.get('chapter');
    const chapterName = document.getElementById('story-name');
    const chapterTextContent = document.getElementById('text-content');
    const before = document.getElementById('before');
    const after = document.getElementById('after');
    const now = document.getElementById('now');
    // users(() => {
    //     if (!users.isSigned) {
    //         return;
    //     }

    // });
    const [
        { data: { chapters: [chapter] }, error }, 
        { data: { story }, error: findStoryError }
    ] = await Promise.all([
        supabase.functions.invoke('getChapters', {
            body: {
                story_id: storyId,
                offset: chapterId - 1,
                limit: 1
            }
        }),
        supabase.functions.invoke('getStory', {
            body: {
                id: storyId
            }
        })
    ]);
    if (error || findStoryError) {
        alert(findStoryError);
        return;
    }
    console.log(chapter);
    chapterName.textContent = `${story.name}`;
    const {data: {url}} = await supabase.functions.invoke('getChapterContent', {
        body: {
            story_id: story.id,
            chapter_index: chapter.index
        }
    });
    now.textContent = `Chương ${chapter.index}: ${chapter.title}`;
    if (chapter.index === 1) {
        before.style.backgroundColor = '#aaa';
    } else {
        before.addEventListener('click', () => {
            window.location.href = `read_chapter.html?id=${story.id}&chapter=${chapter.index - 1}`;
        });
    }
    if (chapter.index === story.chapter_number) {
        after.style.backgroundColor = '#aaa';
    } else {
        after.addEventListener('click', () => {
            window.location.href = `read_chapter.html?id=${story.id}&chapter=${chapter.index + 1}`;
        });
    }
    try {
        const res = await fetch(url);
        if (!res.ok) throw Error('Không thể tải vui lòng thử lại');
        const text = await res.text();
        chapterTextContent.innerText = text;
    }
    catch (e){}
});