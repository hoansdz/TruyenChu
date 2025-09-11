function login() {
    const email = document.getElementById('input-account').value;
    const password = document.getElementById('input-password').value;

    let emailError;
    if (email.length == 0) {
        emailError = 'Tài khoản email không được để trống';
    } else {
        
    }
    let passwordError;
    if (password.length == 0) {
        passwordError = 'Mật khẩu không được để trống';
    } else {
        
    }
    document.getElementById('error-email-message').innerHTML = emailError === undefined ? '' : emailError;
    document.getElementById('error-password-message').innerHTML = passwordError === undefined ? '' : passwordError;
    if (emailError !== undefined || passwordError !== undefined) {
        return;
    }
    const data = {
        email: email,
        password: password,
    };
    fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(result => {
        if (result.state === 'fail') {
            document.getElementById('error-password-message').innerHTML = result.err;
            return;
        }
        window.location.href = 'index.html';
    });

}