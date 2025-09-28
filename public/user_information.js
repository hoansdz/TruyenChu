import supabase from "./supabase.js";
import Utils from "./utils.js";

let isLogoutClicked = false;

async function onPageLoaded() {
    const navigatorAvatar = document.getElementById('avatar');
    const avatar = document.getElementById('user-avatar');
    const inputAvatar = document.getElementById('input-avatar');
    const emptyStory = document.getElementById('empty-story');
    const logout = document.getElementById('logout');
    const userCreatedAt = document.getElementById('user-created-at');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    window.appState.users(async () => {
        if (!window.appState.users.isSigned) {
            window.appState.onNewPage('home');
            return;
        }
        if (window.appState.users.data.created_at !== window.appState.users.cache.created_at) {
            userCreatedAt.textContent = Utils.isoStringToReadableString(window.appState.users.data.created_at);
        }
        if (window.appState.users.data.name !== window.appState.users.cache.name) {
            userName.textContent = window.appState.users.data.name;
        }
        if (window.appState.users.data.email !== window.appState.users.cache.email) {
            userEmail.textContent = window.appState.users.data.email;
        }
        if (window.appState.users.data.avatar_url !== window.appState.users.cache.avatar_url) {
            avatar.src = window.appState.users.data.avatar_url + `?t=${Date.now()}`;
        }
        if (window.appState.users.data.stories.length !== 0) {
            emptyStory.style.display = 'none';
        }
    }, (cache) => {
        if (!window.appState.users.isSigned) {
            window.appState.onNewPage('home');
            return;
        }
        userCreatedAt.textContent = Utils.isoStringToReadableString(cache.created_at);
        userName.textContent = cache.name;
        userEmail.textContent = cache.email;
        if (cache.avatar_url) {
            avatar.src = cache.avatar_url + `?t=${Date.now()}`;
        }
    });
    inputAvatar.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        console.log(e.target.files)
        if (!file || !window.appState.users.isSigned) return;
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            console.log(`Bearer ${window.appState.users.data.session}`);
            const res = await fetch('https://cjjyrcdasvkchicimbjv.supabase.co/functions/v1/updateAvatar', {
                method: 'POST',
                headers: { Authorization: `Bearer ${window.appState.users.data.session}` },
                body: formData
            });
            const { state, message, url } = await res.json();
            if (state !== 'success') {
                alert(message);
                return;
            }
            avatar.src = url + `?t=${Date.now()}`;
            navigatorAvatar.src = url + `?t=${Date.now()}`;
        }
    });
    logout.addEventListener('click', async () => {
        if (isLogoutClicked) return;
        isLogoutClicked = true;
        localStorage.removeItem('users');
        await supabase.auth.signOut();
        window.location.reload();
        window.appState.onNewPage('home');
    });
}

export default onPageLoaded;