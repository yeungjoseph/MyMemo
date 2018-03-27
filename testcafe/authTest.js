import { Role, ClientFunction } from 'testcafe';

fixture('Authentication page')
    .page('http://localhost:3000/auth');

test('Successful login redirects user to tasks page', async (t) => {
    const getPageUrl = ClientFunction(() => window.location.href.toString());

    await t
        .typeText('#login-email', 'test@test.com')
        .typeText('#login-password', 'test')
        .click('#sign-in') // Redirect is still hanging here
    const url = await getPageUrl()
    await t.expect(url).contains('/tasks');
});

test('Unsuccessful login creates an alert', async (t) => {
    await t
        .typeText('#login-email', 'test@test.com')
        .typeText('#login-password', 'wrongpw')
        .click('#sign-in')
    
});

// Successful registration redirects user to tasks page

// Unsuccessful registration creates an alert