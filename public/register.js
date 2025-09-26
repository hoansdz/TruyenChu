import supabase from "./supabase.js";
import showLoginDialog from "./login.js";

async function showRegisterDialog(onSuccess) {
    let isSignup = false;

    const loginDialog = document.getElementById('login-dialog');
    const res = await fetch('register.html');
    const html = await res.text();

    loginDialog.innerHTML = html;

    const goToLogin = document.getElementById('register-go-to-login');
    goToLogin.addEventListener('click', () => {
        showLoginDialog(onSuccess);
    });

    document.getElementById('register-button').addEventListener('click', async () => {
        try {
            const name = document.getElementById('register-input-name').value;
            const email = document.getElementById('register-input-account').value;
            const password = document.getElementById('register-input-password').value;
            const rewritePassword = document.getElementById('register-input-rewrite-password').value;
            let nameError = '';
            if (name.length == 0) {
                nameError = 'Tài khoản email không được để trống';
            } else {

            }
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
            let rewritePasswordError = '';
            if (rewritePassword.length < 6) {
                rewritePasswordError = 'Mật khẩu không được ít hơn 6 kí tự';
            } else {
                if (password !== rewritePassword) {
                    rewritePasswordError = 'Mật khẩu không khớp';
                }
            }
            document.getElementById('register-error-name-message').textContent = nameError;
            document.getElementById('register-error-email-message').textContent = emailError;
            document.getElementById('register-error-password-message').textContent = passwordError;
            document.getElementById('register-error-rewrite-password-message').textContent = rewritePasswordError;
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
                document.getElementById('register-error-rewrite-password-message').textContent = error.message;
                return;
            }
            const { data: { session } } = await supabase.auth.getSession();
            if (!session || !session.access_token) {
                document.getElementById('register-error-rewrite-password-message').textContent = 'Chuaw tao';
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
            onSuccess();
        }
        catch (err) {
            isSignup = false;
            document.getElementById('register-error-rewrite-password-message').textContent = 'Thông tin tài khoản hoặc mật khẩu không chính xác';
        }
    });
}

export default showRegisterDialog;