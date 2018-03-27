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
    const getPageUrl = ClientFunction(() => window.location.href.toString());

    await t
        .setNativeDialogHandler(() => true)
        .typeText('#login-email', 'test@test.com')
        .typeText('#login-password', 'wrongpw')
        .click('#sign-in')
        .expect(getPageUrl()).contains('/auth');
    
    const dialogHistory = await t.getNativeDialogHistory();

    await t
        .expect(dialogHistory[0].type).eql('alert')
        .expect(dialogHistory[0].text).eql('Incorrect login credentials.')
});

test('Unsuccessful registration creates an alert', async(t) => {
    const getPageUrl = ClientFunction(() => window.location.href.toString());

    await t
        .setNativeDialogHandler(() => true)
        .typeText('#register-email', 'test@test.com')
        .typeText('#register-password', 'test')
        .click('#sign-up')
        .expect(getPageUrl()).contains('/auth');
    
    const dialogHistory = await t.getNativeDialogHistory();

    await t
        .expect(dialogHistory[0].type).eql('alert')
        .expect(dialogHistory[0].text).eql('Email has already been taken.')
});