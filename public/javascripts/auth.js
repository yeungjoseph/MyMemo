$('#login-form').submit(function (e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/login',
        data: {
            email: $('#login-email').val().trim(),
            password: $('#login-password').val().trim(),
        }
    })
    .done(function(response) {
        window.location.replace("http://127.0.0.1:3000/tasks");
    })
    .fail(function(err) {
        console.log(err);
        alert("Incorrect login credentials.");
    });
});

$('#register-form').submit(function (e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/user',
        data: {
            email: $('#register-email').val().trim(),
            password: $('#register-password').val().trim(),
        }
    })
    .done(function(response) {
        window.location.replace("http://127.0.0.1:3000/tasks");
    })
    .fail(function(err) {
        console.log(err);
        alert("Email has already been taken.");
    });
});