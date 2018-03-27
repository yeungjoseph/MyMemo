import { Role, ClientFunction } from 'testcafe';

fixture('Authentication page')
    .page('127.0.0.1:3000/auth');

test('Successful login redirects user to tasks page', async (t) => {
    const getPageUrl = ClientFunction(() => window.location.href.toString());

    await t
        .typeText('#login-email', 'test@test.com')
        .typeText('#login-password', 'test')
        .click('#sign-in') // Redirect is still hanging here
        await t.expect(getPageUrl()).contains('/tasks');
});

// Unsuccessful login creates an alert

// Successful registration redirects user to tasks page

// Unsuccessful registration creates an alert