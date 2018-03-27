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
        console.log('in done');
        window.location.href = '/tasks';
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
        window.location.replace("/tasks");
    })
    .fail(function(err) {
        console.log(err);
        alert("Email has already been taken.");
    });
});