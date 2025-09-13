import users from './backend/users.js';

function addStory(parent, story) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const title = document.createElement('p');
    const evaluate = document.createElement('p');
    title.innerHTML = story.title;
    img.src = story.image;
    evaluate.innerHTML = `⭐ ${story.star} / 10`;
    div.appendChild(img);
    div.appendChild(title);
    div.appendChild(evaluate);
    parent.appendChild(div);
}

document.addEventListener('DOMContentLoaded', () => {
    users(() => {
        if (users.isSigned) {
            document.getElementById('login-promo').style.display = 'none';
        }
    });
    const grid = document.getElementById('suggest-grid');
    const stories = [
        {
            image: 'images/i1.jpg',
            title: 'Nhất thế phi thiên',
            star: 8,
        }, 
        {
            image: 'images/i2.jpg',
            title: 'Vợ Nhỏ Yêu Nghiệt Của Âu Thiếu - Đàm Tiểu Ân',
            star: 9,
        }
    ];
    if (stories.length) {
        grid.getElementsByClassName('empty')[0].style.display = 'none';
    }
    for (const story of stories) {
        addStory(grid, story);
    }
    for (let i =0; i<20; ++i) {
        addStory(grid, stories[0]);
    }
});