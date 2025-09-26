import supabase from './supabase.js';

let story;
let chapter;

async function onPageLoaded() {
    const { storyId, chapterId } = JSON.parse(localStorage.getItem('loading_chapter'));

    const chapterName = document.getElementById('rct-story-name');
    const chapterTextContent = document.getElementById('rct-text-content');
    const before = document.getElementById('rct-before');
    const after = document.getElementById('rct-after');
    const now = document.getElementById('rct-now');

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

    const { data: { url } } = await supabase.functions.invoke('getChapterContent', {
        body: {
            story_id: story.id,
            chapter_index: chapter.index
        }
    });

    now.textContent = `Chương ${chapter.index}: ${chapter.title}`;

    if (chapter.index === 1) {
        before.style.backgroundColor = '#aaa';
    } else {
        before.style.backgroundColor = 'rgb(42, 255, 255)';
        before.addEventListener('click', () => {
            localStorage.setItem('loading_chapter', JSON.stringify({
                storyId: storyId,
                chapterId: chapterId - 1
            }));
            onPageLoaded();
        });
    }

    if (chapter.index === story.chapter_number) {
        after.style.backgroundColor = '#aaa';
    } else {
        after.style.backgroundColor = 'rgb(42, 255, 255)';
        after.addEventListener('click', () => {
            localStorage.setItem('loading_chapter', JSON.stringify({
                storyId: storyId,
                chapterId: chapterId + 1
            }));
            onPageLoaded();
        });
    }

    try {
        const res = await fetch(url);
        if (!res.ok) throw Error('Không thể tải vui lòng thử lại');
        const text = await res.text();
        chapterTextContent.innerText = text;
    }
    catch (e) { }
}

export default onPageLoaded;