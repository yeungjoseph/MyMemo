import { Role, ClientFunction } from 'testcafe';

const testUser = Role('http://127.0.0.1:3000/auth', async (t) => {
    await t
        .typeText('#login-email', 'test@test.com')
        .typeText('#login-password', 'test')
        .click('#sign-in') 
});

fixture('Home page')
    .page('127.0.0.1:3000/');

test('Authentication button redirects to auth page', async (t) => {
    const getPageUrl = ClientFunction(() => window.location.href.toString());

    await t
        .click('#toAuth')
        .expect(getPageUrl()).contains('/auth');
});

test('Task list button redirects to auth page if user not logged in', async (t) => {
    const getPageUrl = ClientFunction(() => window.location.href.toString());

    await t
        .click('#toTasks')
        .expect(getPageUrl()).contains('/auth');
});

test('Task list button redirects to task page if user is logged in', async (t) => {
    const getPageUrl = ClientFunction(() => window.location.href.toString());
    await t
        .useRole(testUser)
        .click('#toTasks')
        .expect(getPageUrl()).contains('/tasks');
});

test('Authentication button redirects to task page if user is logged in', async (t) => {
    const getPageUrl = ClientFunction(() => window.location.href.toString());
    await t
        .useRole(testUser)
        .click('#toAuth')
        .expect(getPageUrl()).contains('/auth');
});

