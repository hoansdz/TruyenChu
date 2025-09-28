import MainJSOnPageLoaded from "../main.js";
import UserInformationOnPageLoaded from '../user_information.js';
import ReadStoryOnPageLoaded from '../read_story.js';
import CreateStoryOnPageLoaded from '../create_story.js';
import ReadChapterOnPageLoaded from '../read_chapter.js';
import ManageStoriesOnPageLoaded from '../manage_story.js';

async function loadPage(content, name, loadFunction) {
    const res = await fetch(name);
    content.innerHTML = await res.text();
    loadFunction(window.appState);
    history.replaceState({}, '', `index.html?route=${window.appState.page}`);
}

async function onNewPage(content) {
    switch (window.appState.page) {
        case 'home': {
            loadPage(content, './main.html', MainJSOnPageLoaded);
            break;
        }
        case 'my-account': {
            loadPage(content, './user_information.html', UserInformationOnPageLoaded);
            break;
        }
        case 'story': {
            loadPage(content, './read_story.html', ReadStoryOnPageLoaded);
            break;
        }
        case 'create-story': {
            loadPage(content, './create_story.html', CreateStoryOnPageLoaded);
            break;
        }
        case 'read-chapter': {
            loadPage(content, './read_chapter.html', ReadChapterOnPageLoaded);
            break;
        }
        case 'manage-story': {
            loadPage(content, './manage_story.html', ManageStoriesOnPageLoaded);
            break;
        }
    }
}

function createAppState(users, content) {
    window.appState = {
        page: 'home',
        users: users,
        isUserDataReady: false,
        onUserReady: (callback) => {
            if (window.appState.isUserDataReady) {
                callback(window.appState.users);
                return;
            }
        },
        onNewPage: async (page) => {
            window.appState.page = page;
            await onNewPage(content);
        },
    };
}

export default createAppState;