const { chai, server, agent, should } = require('./utilsTest.js');
const db = require('../models/index');

/*
    Test auth.js routes
    -/tasks              GET
    -/tasks/search       GET
    -/tasks/searchdate   GET
    -/tasks              POST
    -/tasks/:id          DELETE
    -/tasks/:id/inProg   PATCH
    -/tasks/:id          PATCH
*/

describe('Tasks', () => {
    beforeEach(done => {
        // Clear "Users" database
        db.sequelize
        .query('DELETE FROM "Users"', {
            type: db.sequelize.QueryTypes.DELETE
        })
        .then(() => {
            // Clear "Tasks" database and id counter
            db.sequelize
            .query('TRUNCATE TABLE "Tasks" RESTART IDENTITY', {
                type: db.sequelize.QueryTypes.DELETE
            })
            .then(() => {
                // Reset "Users" database id counter
                db.sequelize
                .query('ALTER SEQUENCE "Users_id_seq" RESTART WITH 1')
                .then(() => {
                    // Add test user into database
                    const testUser = {
                        email: 'test@test.com',
                        password: db.User.hashPassword('test')
                    };
                    const insert = 'INSERT INTO "Users" (email, password) VALUES (?, ?) RETURNING id';
                    db.sequelize
                    .query(insert, {
                        replacements: [testUser.email, testUser.password], 
                        type: db.sequelize.QueryTypes.INSERT,
                    })
                    .spread((results, metadata) => {
                        // Authenticate the user agent
                        const new_id = results[0].id;
                        agent
                        .post('/login')
                        .send({ email: testUser.email, password: 'test' })
                        .end ((err, res) => {
                            if (err) throw err;
                            // Create a task belonging to the current user
                            const testTask = {
                                title: 'Test task',
                                description: 'Test description',
                                finishBy: null,
                                inProg: true
                            }
                            const insert = 'INSERT INTO "Tasks" (title, description, "finishBy", "userId", "inProg") VALUES (?, ?, ?, ?, ?)'
                            return db.sequelize
                            .query(insert, {
                                replacements: [testTask.title, testTask.description, testTask.finishBy, new_id, testTask.inProg],
                                type: db.sequelize.QueryTypes.INSERT,
                            })
                            .then(() => {
                                done();
                            })
                            .catch(err => console.log(err));   
                        });
                    })
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));       
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    });

    afterEach(done => {
        db.sequelize
        .query('DELETE FROM "Users"', {
            type: db.sequelize.QueryTypes.DELETE
        })
        .then(() => {
            // Clear "Tasks" database and id counter
            db.sequelize
            .query('TRUNCATE TABLE "Tasks" RESTART IDENTITY', {
                type: db.sequelize.QueryTypes.DELETE
            })
            .then(() => done())
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    });

    describe('/tasks GET', () => {
        it('should render a task list page with all the users tasks', done => {
            agent
            .get('/tasks')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
        });
        it('should redirect the user to auth page if not logged in', done => {
            chai.request(server)
            .get('/tasks')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                res.should.redirectTo(res.request.protocol + '//' + 
                    res.request.host + '/auth');
                done();
            });
        });
    });

    describe('/tasks/search GET', () => {
        it('should return a task with matching title', done => {
            agent
            .get('/tasks/search')
            .query({ search: 'description' })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('title');
                res.body[0].should.have.property('description');
                res.body[0].should.have.property('finishBy');
                res.body[0].should.have.property('userId');
                res.body[0].should.have.property('inProg');
                res.body[0].id.should.be.a('number');
                res.body[0].title.should.be.a('string');
                res.body[0].title.should.equal('Test task');
                res.body[0].description.should.be.a('string');
                res.body[0].description.should.equal('Test description');
                should.not.exist(res.body[0].finishBy);
                res.body[0].userId.should.be.a('number');
                res.body[0].inProg.should.be.a('boolean');
                res.body[0].inProg.should.equal(true);
                done();
            });
        });
        it('should return a task with matching description', done => {
            agent
            .get('/tasks/search')
            .query({ search: 'task' })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('title');
                res.body[0].should.have.property('description');
                res.body[0].should.have.property('finishBy');
                res.body[0].should.have.property('userId');
                res.body[0].should.have.property('inProg');
                res.body[0].id.should.be.a('number');
                res.body[0].title.should.be.a('string');
                res.body[0].title.should.equal('Test task');
                res.body[0].description.should.be.a('string');
                res.body[0].description.should.equal('Test description');
                should.not.exist(res.body[0].finishBy);
                res.body[0].userId.should.be.a('number');
                res.body[0].inProg.should.be.a('boolean');
                res.body[0].inProg.should.equal(true);
                done();
            });
        });
        it('should return an empty array when searching for a task with no matches', done => {
            agent
            .get('/tasks/search')
            .query({ search: 'invalid match' })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.be.empty;
                done();
            });
        });
        it('should redirect the user to auth page if not logged in', done => {
            chai.request(server)
            .get('/tasks/search')
            .query({ search: 'task' })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                res.should.redirectTo(res.request.protocol + '//' + 
                    res.request.host + '/auth');
                done();
            });
        });
    });

    describe('/tasks/searchdate', () => {
        it('should return a task with a matching date', done => {
            agent
            .get('/tasks/searchdate')
            .query({ search: '' })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('title');
                res.body[0].should.have.property('description');
                res.body[0].should.have.property('finishBy');
                res.body[0].should.have.property('userId');
                res.body[0].should.have.property('inProg');
                res.body[0].id.should.be.a('number');
                res.body[0].title.should.be.a('string');
                res.body[0].title.should.equal('Test task');
                res.body[0].description.should.be.a('string');
                res.body[0].description.should.equal('Test description');
                should.not.exist(res.body[0].finishBy);
                res.body[0].userId.should.be.a('number');
                res.body[0].inProg.should.be.a('boolean');
                res.body[0].inProg.should.equal(true);
                done();
            });
        });
        it('should return an error when searching with an invalid date', done => {
            agent
            .get('/tasks/searchdate')
            .query({ search: 'invalid match' })
            .end((err, res) => {
                res.should.have.status(500);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.a.property('name').eql('SequelizeDatabaseError')
                done();
            });
        });
        it('should return an empty array when searching for a date with no matches', done => {
            agent
            .get('/tasks/searchdate')
            .query({ search: '2018-03-21' })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.be.empty;
                done();
            });
        })
        it('should redirect the user to auth page if not logged in', done => {
            chai.request(server)
            .get('/tasks/searchdate')
            .query({ search: 'task' })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                res.should.redirectTo(res.request.protocol + '//' + 
                    res.request.host + '/auth');
                done();
            });
        });
    });

    describe('/tasks POST', () => {
        it('should create a new task with a title, description, and date', done => {
            agent
            .post('/tasks')
            .send({ 
                title: 'new task',
                desc: 'new desc',
                finishBy: '2018-03-14',
                inProg: 'false'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('finishBy');
                res.body.should.have.property('userId');
                res.body.should.have.property('inProg');
                res.body.id.should.be.a('number');
                res.body.title.should.be.a('string');
                res.body.title.should.equal('new task');
                res.body.description.should.be.a('string');
                res.body.description.should.equal('new desc');
                res.body.finishBy.should.be.a('string');
                res.body.finishBy.should.equal('2018-03-14');
                res.body.userId.should.be.a('number');
                res.body.inProg.should.be.a('boolean');
                res.body.inProg.should.equal(false);
                done();
            });
        });
        it('should create a new task with only a title and description', done => {
            agent
            .post('/tasks')
            .send({ 
                title: 'new task',
                desc: 'new desc',
                finishBy: '',
                inProg: 'false'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('finishBy');
                res.body.should.have.property('userId');
                res.body.should.have.property('inProg');
                res.body.id.should.be.a('number');
                res.body.title.should.be.a('string');
                res.body.title.should.equal('new task');
                res.body.description.should.be.a('string');
                res.body.description.should.equal('new desc');
                should.not.exist(res.body.finishBy);
                res.body.userId.should.be.a('number');
                res.body.inProg.should.be.a('boolean');
                res.body.inProg.should.equal(false);
                done();
            });
        });
        it('should create a new task with only a title and date', done => {
            agent
            .post('/tasks')
            .send({ 
                title: 'new task',
                desc: '',
                finishBy: '2018-03-14',
                inProg: 'false'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('finishBy');
                res.body.should.have.property('userId');
                res.body.should.have.property('inProg');
                res.body.id.should.be.a('number');
                res.body.title.should.be.a('string');
                res.body.title.should.equal('new task');
                res.body.description.should.be.a('string');
                res.body.description.should.equal('');
                res.body.finishBy.should.be.a('string');
                res.body.finishBy.should.equal('2018-03-14');
                res.body.userId.should.be.a('number');
                res.body.inProg.should.be.a('boolean');
                res.body.inProg.should.equal(false);
                done();
            });
        });
        it('should create a new task with only a title', done => {
            agent
            .post('/tasks')
            .send({ 
                title: 'new task',
                desc: '',
                finishBy: '',
                inProg: 'false'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('finishBy');
                res.body.should.have.property('userId');
                res.body.should.have.property('inProg');
                res.body.id.should.be.a('number');
                res.body.title.should.be.a('string');
                res.body.title.should.equal('new task');
                res.body.description.should.be.a('string');
                res.body.description.should.equal('');
                should.not.exist(res.body.finishBy);
                res.body.userId.should.be.a('number');
                res.body.inProg.should.be.a('boolean');
                res.body.inProg.should.equal(false);
                done();
            });
        });
        it('should return an error when trying to create a task without a title', done => {
            agent
            .post('/tasks')
            .send({ 
                title: '',
                desc: '',
                finishBy: '',
                inProg: ''
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.html;
                done();
            })
        });
        it('should redirect the user to auth page if not logged in', done => {
            chai.request(server)
            .post('/tasks')
            .send({ 
                title: 'new task',
                desc: 'new desc',
                finishBy: '2018-04-21',
                inProg: false
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                res.should.redirectTo(res.request.protocol + '//' + 
                    res.request.host + '/auth');
                done();
            });
        });
    });

    describe('/tasks:id DELETE', () => {
        it('should delete a task with the specified id', done => {
            agent
            .delete('/tasks/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.success.should.equal(true);
                done();
            });
        });
        it('should return an error if no task has the specified id', done => {
            agent
            .delete('/tasks/12')
            .end((err, res) => {
                res.should.have.status(404);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.success.should.equal(false);
                done();
            });
        });
        it('should redirect the user to auth page if not logged in', done => {
            chai.request(server)
            .delete('/tasks/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                res.should.redirectTo(res.request.protocol + '//' + 
                    res.request.host + '/auth');
                done();
            });
        });
    });

    describe('/tasks/:id/inProg PATCH', () => {
        it('should flip a tasks inProg boolean value', done => {
            agent
            .patch('/tasks/1/inProg')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.success.should.equal(true);
                done();
            });
        });
        it('should return an error if no task has the specified id', done => {
            agent
            .patch('/tasks/3/inProg')
            .end((err, res) => {
                res.should.have.status(404);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.success.should.equal(false);
                done();
            });
        });
        it('should redirect the user to auth page if not logged in', done => {
            chai.request(server)
            .patch('/tasks/1/inProg')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                res.should.redirectTo(res.request.protocol + '//' + 
                    res.request.host + '/auth');
                done();
            });
        });
    });

    describe('/tasks/:id PATCH', () => {
        it('should update title, description, and finishBy of an existing task', done => {
            agent
            .patch('/tasks/1')
            .send({
                title: 'editted task',
                desc: 'editted desc',
                finishBy: '2018-04-21'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.success.should.equal(true);
                done();
            });
        });
        it('should return an error if no task has the specified id', done => {
            agent
            .patch('/tasks/2')
            .send({
                title: 'editted task',
                desc: 'editted desc',
                finishBy: '2018-04-21'
            })
            .end((err, res) => {
                res.should.have.status(404);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.success.should.equal(false);
                done();
            });
        });
        it('should redirect the user to auth page if not logged in', done => {
            chai.request(server)
            .patch('/tasks/1')
            .send({ 
                title: 'editted task',
                desc: 'editted desc',
                finishBy: '2018-04-21'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                res.should.redirectTo(res.request.protocol + '//' + 
                    res.request.host + '/auth');
                done();
            });
        });
    });
});