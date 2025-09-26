import supabase from './supabase.js';
import showRegisterDialog from './register.js';

async function showLoginDialog(onSuccess) {
    const loginDialog = document.getElementById('login-dialog');
    const res = await fetch('./login.html');
    const html = await res.text();
    loginDialog.innerHTML = html;

    let isSignin = false;

    const goToRegister = document.getElementById('go-to-register');
    goToRegister.addEventListener('click', () => {
        showRegisterDialog(onSuccess);
    });

    document.getElementById('login-button').addEventListener('click', async () => {
        try {
            if (isSignin) return;
            const email = document.getElementById('input-account').value;
            const password = document.getElementById('input-password').value;

            let emailError = '';
            if (email.length == 0) {
                emailError = 'Tài khoản email không được để trống';
            } else {

            }
            let passwordError = '';
            if (password.length < 6) {
                passwordError = 'Mật khẩu không được ít hơn 6 kí tự';
            } else {

            }
            document.getElementById('error-email-message').textContent = emailError;
            document.getElementById('error-password-message').textContent = passwordError;
            if (emailError || passwordError) {
                return;
            }
            isSignin = true;
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (error) {
                document.getElementById('error-password-message').textContent = err.message;
                isSignin = false;
                return;
            }
            onSuccess();
        }
        catch (err) {
            isSignin = false;
            document.getElementById('error-password-message').textContent = `Thông tin tài khoản hoặc mật khẩu không chính xác ${err}`;
        }
    });
}

export default showLoginDialog;