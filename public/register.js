import supabase from "./supabase.js";

let isSignup = false;

document.getElementById('dialog').addEventListener('click', function (e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

document.getElementById('register-button').addEventListener('click', async () => {
    try {
        const name = document.getElementById('input-name').value;
        const email = document.getElementById('input-account').value;
        const password = document.getElementById('input-password').value;
        const rewritePassword = document.getElementById('input-rewrite-password').value;
        let nameError;
        if (name.length == 0) {
            nameError = 'Tài khoản email không được để trống';
        } else {

        }
        let emailError;
        if (email.length == 0) {
            emailError = 'Tài khoản email không được để trống';
        } else {

        }
        let passwordError;
        if (password.length < 6) {
            passwordError = 'Mật khẩu không được ít hơn 6 kí tự';
        } else {

        }
        let rewritePasswordError;
        if (password !== rewritePassword) {
            rewritePasswordError = 'Mật khẩu không khớp';
        }
        document.getElementById('error-name-message').textContent = nameError ?? '';
        document.getElementById('error-email-message').textContent = emailError ?? '';
        document.getElementById('error-password-message').textContent = passwordError ?? '';
        document.getElementById('error-rewrite-password-message').textContent = rewritePasswordError ?? '';
        if (nameError !== undefined || emailError !== undefined ||
            passwordError !== undefined || rewritePasswordError !== undefined ||
            isSignup) {
            return;
        }
        isSignup = true;
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        if (error) {
            document.getElementById('error-rewrite-password-message').textContent = error.message;
            return;
        }
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.access_token) {
            document.getElementById('error-rewrite-password-message').textContent = 'Chuaw tao';
            return;
        }
        const { data: { state }, error: e } = await supabase.functions.invoke('register', {
            body: { name: name },
        });
        if (e) {
            throw '';
        }
        if (state === 'fail') {
            throw '';
        }
        window.location.href = 'index.html';
        // document.getElementById('dialog').style.display = 'flex';
    }
    catch (err) {
        isSignup = false;
        document.getElementById('error-rewrite-password-message').textContent = 'Thông tin tài khoản hoặc mật khẩu không chính xác';
    }
});