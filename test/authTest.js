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
    // Clear the database and repopulate with a dummy user
    beforeEach(done => {
        db.User.destroy({ where: {} })
        .then(() => {
            const testUser = {
                email: 'test@test.com',
                password: 'test'
            };

            db.User.create(testUser)
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
        it('should redirect to auth page if no user is logged in');
        it('should reset user session and redirect to auth page if a user is logged in');
    });

    describe('/login POST', () => {
        it('should send error upon failed login due to nonexistent email');
        it('should send error upon failed login due to incorrect password');
        it('should send error upon failed login due to password with only spaces');
        it('should redirect user to task page upon successful login');
    });

    describe('/user POST', () => {
        it('should create user and redirect to task page upon successful registration');
        it('should send error upon attempting to register with an already taken email');
        it('should send error upon attempting to register with a password containing only spaces');
    });
});