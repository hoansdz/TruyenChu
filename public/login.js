import supabase from './supabase.js';

let isSignin = false;

document.getElementById('login-button').addEventListener('click', async () => {
    try {
        if (isSignin) return;
        const email = document.getElementById('input-account').value;
        const password = document.getElementById('input-password').value;

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
        document.getElementById('error-email-message').innerHTML = emailError === undefined ? '' : emailError;
        document.getElementById('error-password-message').innerHTML = passwordError === undefined ? '' : passwordError;
        if (emailError !== undefined || passwordError !== undefined) {
            return;
        }
        isSignin = true;
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error) {
            document.getElementById('error-password-message').innerHTML = err.message;
            signIn = false;
            return;
        }
        window.location.href = 'index.html';
    }
    catch (err) {
        isSignin = false;
        document.getElementById('error-password-message').innerHTML = `Thông tin tài khoản hoặc mật khẩu không chính xác ${err}`;
    }
});