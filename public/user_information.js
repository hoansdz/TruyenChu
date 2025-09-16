import supabase from "./supabase.js";
import users from "./backend/users.js";

document.addEventListener('DOMContentLoaded', async () => {
    const avatar = document.getElementById('avatar');
    const inputAvatar = document.getElementById('input-avatar');
    users(async () => {
        if (!users.isSigned) {
            window.location.href = 'login.html';
            return;
        }
        console.log(users.data);
        document.getElementById('user-created-at').innerHTML = isoStringToReadableString(users.data.created_at);
        document.getElementById('user-name').innerHTML = users.data.name;
        document.getElementById('user-email').innerHTML = users.email;
        if (users.data.avatar_url !== null) {
            document.getElementById('avatar').src = users.data.avatar_url + `?t=${Date.now()}`;
        }

    });
    inputAvatar.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        console.log(e.target.files)
        if (!file) return;
        // const mUrl = URL.createObjectURL(file);
        // document.getElementById('avatar').src = mUrl;
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            console.log(`Bearer ${users.session}`);
            const res = await fetch('https://cjjyrcdasvkchicimbjv.supabase.co/functions/v1/updateAvatar', {
                method: 'POST',
                headers: {Authorization: `Bearer ${users.session}`},
                body: formData
            });
            const {state, message, url} = await res.json();
            if (state !== 'success') {
                alert(message ?? 'Ưtf');
                return;
            }
                
            document.getElementById('avatar').src = url + `?t=${Date.now()}`;
        }
    });
});

function isoStringToReadableString(isoString) {
    return new Date(isoString).toLocaleString('vi-VN',{
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).replace('lúc', 'Lúc');
}