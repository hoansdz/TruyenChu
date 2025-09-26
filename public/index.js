import users from "./backend/users.js";
import supabase from "./supabase.js";
import showLoginDialog from './login.js';
import storyCategory from './backend/story_category.js';
import createAppState from "./backend/state.js";

function addSearchCategoryDropboxItems() {
    const searchCategoryDropbox = document.getElementById('search-category-dropbox-area');
    for (const key in storyCategory) {
        const p = document.createElement('p');
        p.textContent = storyCategory[key];
        searchCategoryDropbox.appendChild(p);
    }
}

async function loadNavigator() {
    const avatar = document.getElementById('avatar');
    const notifications = document.getElementById('notifications');
    const optionsDropbox = document.getElementById('options-dropbox');
    const loginButton = document.getElementById('open-login-dialog');
    const userCoins = document.getElementById('user-coins');
    const coinArea = document.getElementById('coin-item');
    const loginDialog = document.getElementById('login-dialog');
    const content = document.getElementById('content');
    createAppState(users, content);
    users(async () => {
        if (!users.isSigned) {
            coinArea.style.display = 'none';
            notifications.style.display = 'none';
            avatar.style.display = 'none';
            return;
        }
        if (users.data.private.coins !== users.cache.private.coins) {
            userCoins.textContent = users.data.private.coins;
        }
        if (users.data.private.avatar_url !== users.cache.private.avatar_url) {
            avatar.src = users.data.avatar_url + `?t=${Date.now()}`;
        }
    }, (cache) => {
        if (!users.isSigned) {
            coinArea.style.display = 'none';
            notifications.style.display = 'none';
            avatar.style.display = 'none';
            return;
        }
        loginButton.style.display = 'none';
        userCoins.textContent = cache.private.coins;
        if (cache.avatar_url) {
            avatar.src = cache.avatar_url + `?t=${Date.now()}`;
        }
    });
    addSearchCategoryDropboxItems();
    document.getElementById('my-account').addEventListener('click', () => {
        window.appState.onNewPage('my-account');
        optionsDropbox.style.display = 'none';
    });
    document.getElementById('create-story').addEventListener('click', () => {
        window.appState.onNewPage('create-story');
        optionsDropbox.style.display = 'none';
    });
    optionsDropbox.style.display = 'none';
    avatar.addEventListener('click', () => {
        optionsDropbox.style.display = optionsDropbox.style.display === 'none' ? 'flex' : 'none';
    });
    document.getElementById('home-navigator-item').addEventListener('click', () => {
        window.appState.onNewPage('home');
    });
    loginButton.addEventListener('click', () => {
        loginDialog.style.display = 'flex';
        showLoginDialog(async () => {
            loginDialog.style.display = 'none';
            loginDialog.innerHTML = '';
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                return;
            }
            const [
                { data: { session }, error: getSessionError },
                { data: { userData: information }, error: getInformationError },
                { data: { userData: privateInformation }, error: getPrivateInformationError }
            ] = await Promise.all([
                supabase.auth.getSession(),
                supabase.functions.invoke('getUserInformation', {
                    body: { userId: user.id }
                }),
                supabase.functions.invoke('getPrivateData', {
                    body: {},
                })
            ]);
            if (getSessionError || userError || getInformationError || getPrivateInformationError) {
                return;
            }
            users.data = {
                ...information,
                email: user.email,
                session: session.access_token,
                private: privateInformation
            };
            localStorage.setItem('users', JSON.stringify(users.data));
            window.location.reload();
        });
    });
    loginDialog.addEventListener('click', (e) => {
        if (e.target !== loginDialog) return;
        loginDialog.style.display = 'none';
        loginDialog.innerHTML = '';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadNavigator();
    let path = new URLSearchParams(window.location.search).get('route');
    if (!path) {
        window.appState.page = 'home';
    } else {
        window.appState.page = path;
    }
    window.appState.onNewPage(window.appState.page);
});