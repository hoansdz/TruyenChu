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
    if (emailError !== undefined || passwordError == undefined) {
        return;
    }
    const data = {
        email: email,
        password: password,
    };
    fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: data,
    })
    .then(res => res.json())
    .then(data => {
        let success = data.success;
        if (!success) {
            alert('Đã có lỗi xảy ra');
        }
    });

}