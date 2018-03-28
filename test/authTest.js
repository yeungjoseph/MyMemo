const { chai, server, agent, should } = require('./utilsTest.js');
const db = require('../models/index');

/*
    Test auth.js routes
    -/auth   GET
    -/logout GET
    -/login  POST
    -/user   POST
*/

describe('Auth', () => {
    // Clear the database and repopulate with a test user
    beforeEach(done => {
        db.sequelize
        .query('DELETE FROM "Users"', {
            type: db.sequelize.QueryTypes.DELETE
        })
        .then(() => {
            const testUser = {
                email: 'test@test.com',
                password: db.User.hashPassword('test')
            };

            const insert = 'INSERT INTO "Users" (email, password) VALUES (?, ?)';
            db.sequelize
            .query(insert, {
                replacements: [testUser.email, testUser.password], 
                type: db.sequelize.QueryTypes.INSERT,
            })
            .then(user => done())
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    });

    describe('/auth GET', () => {
        it('should return the login and registration page', done => {
            chai.request(server)
            .get('/auth')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
        });
    });

    describe('/logout GET', () => {
        it('should redirect to auth page upon logout', done => {
            chai.request(server)
            .get('/logout')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                res.should.redirectTo(res.request.protocol + '//' + 
                    res.request.host + '/auth');
                done();
            });
        });
    });

    describe('/login POST', () => {
        it('should send error upon failed login due to nonexistent email', done => {
            chai.request(server)
            .post('/login')
            .send({ email: 'doesntexist@gmail.com', password: 'whateverpass' })
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.html;
                done();
            });
        });
        it('should send error upon failed login due to incorrect password', done => {
            chai.request(server)
            .post('/login')
            .send({ email: 'test@test.com', password: 'whateverpass' })
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.html;
                done();
            });
        });
        it('should send error upon failed login due to password with only spaces', done => {
            chai.request(server)
            .post('/login')
            .send({ email: 'test@test.com', password: '      ' })
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.html;
                done();
            });
        });
        it('should receive a status code of 200 upon successful login', done => {
            chai.request(server)
            .post('/login')
            .send({ email: 'test@test.com', password: 'test' })
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
        });
    });

    describe('/user POST', () => {
        it('should create user and redirect to task page upon successful registration', done => {
            chai.request(server)
            .post('/user')
            .send({ email: 'new@new.com', password: 'new' })
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                res.should.redirectTo(res.request.protocol + '//' + 
                    res.request.host + '/tasks');
                done();
            });
        });
        it('should send error upon attempting to register with an already taken email', done => {
            chai.request(server)
            .post('/user')
            .send({ email: 'test@test.com', password: 'whatever' })
            .end(function(err, res) {
                res.should.have.status(500);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.a.property('name').eql('SequelizeUniqueConstraintError');
                done();
            });
        });
        it('should send error upon attempting to register with a password containing only spaces', done => {
            chai.request(server)
            .post('/user')
            .send({ email: 'new@new.com', password: '     ' })
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.html;
                done();
            });
        });
    });
});