import { Role, Selector } from 'testcafe';

const testUser = Role('http://127.0.0.1:3000/auth', async (t) => {
    await t
        .typeText('#login-email', 'test@test.com')
        .typeText('#login-password', 'test')
        .click('#sign-in') 
}, { preserverUrl: true });

fixture('Tasks page')
    .page('127.0.0.1:3000/tasks');

test('Add form is cleared and disappears when task is successfully created', async (t) => {
    await t
        .useRole(testUser)
        .navigateTo('/tasks')
        .click('.add-task-day')
        .typeText('#task-title', 'Some title')
        .typeText('#task-desc', 'Some description')
        .typeText('#task-date', '2018-03-10')
        .click('#add-task-submit');
    
    const addForm = await Selector('.add-task-form');
    const titleInput = await Selector('#task-title');
    const descriptionInput = await Selector('#task-desc');
    const dateInput = await Selector('#task-date');
    
    await t
        .expect(addForm.visible).notOk()
        .expect(titleInput.value).eql('')
        .expect(descriptionInput.value).eql('')
        .expect(dateInput.value).eql('');
});

test('Task shows up in the correct table after being created', async (t) => {
    await t
        .useRole(testUser)
        .navigateTo('/tasks')

    const tasks = await Selector('.task-content-day').child('.task-singular-container');
    const taskCount = await tasks.count;
    const newTask = await tasks.nth(0);

    await t
        .expect(taskCount).eql(1)
        .expect(newTask.hasAttribute('data-task-inprog')).ok()
        .expect(newTask.hasAttribute('data-task-id')).ok()
        .expect(newTask.hasAttribute('data-task-description')).ok()
        .expect(newTask.getAttribute('data-task-inprog')).eql('true')
        .expect(newTask.getAttribute('data-task-description')).eql('Some description')
});

test('Edit form disappears when task is successfully editted', async (t) => {
    await t
        .useRole(testUser)
        .navigateTo('/tasks')
        .click('.btn-edit')
        .typeText('#edit-task-title', 'Editted title', { replace: true })
        .typeText('#edit-task-description', 'Editted description', { replace: true })
        .typeText('#edit-task-date', '2018-04-15', { replace: true })
        .click('#edit-task-submit');

    const editForm = await Selector('.edit-task-form');

    await t
        .expect(editForm.visible).notOk();
});

test('Task shows up with editted information after being editted', async (t) => {
    await t
        .useRole(testUser)
        .navigateTo('/tasks')

    const tasks = await Selector('.task-content-day').child('.task-singular-container');
    const taskCount = await tasks.count;
    const edittedTask = await tasks.nth(0);

    await t
        .expect(taskCount).eql(1)
        .expect(edittedTask.hasAttribute('data-task-inprog')).ok()
        .expect(edittedTask.hasAttribute('data-task-id')).ok()
        .expect(edittedTask.hasAttribute('data-task-description')).ok()
        .expect(edittedTask.getAttribute('data-task-inprog')).eql('true')
        .expect(edittedTask.getAttribute('data-task-description')).eql('Editted description')
});

test('Task can be moved to a different table after being created', async (t) => {
    await t
        .useRole(testUser)
        .navigateTo('/tasks')
        .click('.btn-task-switcher');

    const dayTaskCount = await Selector('.task-content-day').child('.task-singular-container').count;
    const allTasks = await Selector('.task-content-all').child('.task-singular-container');
    const allTaskCount = await allTasks.count;
    const task = await allTasks.nth(0);

    await t
        .expect(dayTaskCount).eql(0)
        .expect(allTaskCount).eql(1)
        .expect(task.hasAttribute('data-task-inprog')).ok()
        .expect(task.hasAttribute('data-task-id')).ok()
        .expect(task.hasAttribute('data-task-description')).ok()
        .expect(task.getAttribute('data-task-inprog')).eql('false')
        .expect(task.getAttribute('data-task-description')).eql('Editted description');
});

test('Only display tasks that match the search criteria', async (t) => {
    await t
        .useRole(testUser)
        .navigateTo('/tasks')
        .typeText('#search-input', 'Editted')
        .click('#search-submit')

    const dayTaskCount = await Selector('.task-content-day').child('.task-singular-container').count;
    const allTasks = await Selector('.task-content-all').child('.task-singular-container');
    const allTaskCount = await allTasks.count;
    const task = await allTasks.nth(0);

    await t
        .expect(dayTaskCount).eql(0)
        .expect(allTaskCount).eql(1)
        .expect(task.hasAttribute('data-task-inprog')).ok()
        .expect(task.hasAttribute('data-task-id')).ok()
        .expect(task.hasAttribute('data-task-description')).ok()
        .expect(task.getAttribute('data-task-inprog')).eql('false')
        .expect(task.getAttribute('data-task-description')).eql('Editted description');
});

test('Only display tasks that match the date search criteria', async (t) => {
    await t
        .useRole(testUser)
        .navigateTo('/tasks')
        .typeText('#search-date-input', '2018-04-15')
        .click('#search-date-submit')

    const dayTaskCount = await Selector('.task-content-day').child('.task-singular-container').count;
    const allTasks = await Selector('.task-content-all').child('.task-singular-container');
    const allTaskCount = await allTasks.count;
    const task = await allTasks.nth(0);

    await t
        .expect(dayTaskCount).eql(0)
        .expect(allTaskCount).eql(1)
        .expect(task.hasAttribute('data-task-inprog')).ok()
        .expect(task.hasAttribute('data-task-id')).ok()
        .expect(task.hasAttribute('data-task-description')).ok()
        .expect(task.getAttribute('data-task-inprog')).eql('false')
        .expect(task.getAttribute('data-task-description')).eql('Editted description');
});

test("Don't display any tasks if no tasks match the search criteria", async (t) => {
    await t
        .useRole(testUser)
        .navigateTo('/tasks')
        .typeText('#search-input', 'No matches')
        .click('#search-submit')

    const dayTaskCount = await Selector('.task-content-day').child('.task-singular-container').count;
    const allTaskCount = await Selector('.task-content-all').child('.task-singular-container').count;

    await t
        .expect(dayTaskCount).eql(0)
        .expect(allTaskCount).eql(0)
});

test("Don't display any tasks if no tasks match the date search criteria", async (t) => {
    await t
        .useRole(testUser)
        .navigateTo('/tasks')
        .typeText('#search-date-input', '2018-04-04')
        .click('#search-date-submit')

    const dayTaskCount = await Selector('.task-content-day').child('.task-singular-container').count;
    const allTaskCount = await Selector('.task-content-all').child('.task-singular-container').count;

    await t
        .expect(dayTaskCount).eql(0)
        .expect(allTaskCount).eql(0)
});

test('Task can be deleted after being created', async (t) => {
    await t
        .useRole(testUser)
        .navigateTo('/tasks')
        .click('.btn-delete')

    const dayTaskCount = await Selector('.task-content-day').child('.task-singular-container').count;
    const allTaskCount = await Selector('.task-content-all').child('.task-singular-container').count;

    await t
        .expect(dayTaskCount).eql(0)
        .expect(allTaskCount).eql(0)
});