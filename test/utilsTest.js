// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
chai.use(chaiHttp);
const agent = chai.request.agent(server);
const should = chai.should();

module.exports = {
    chai,
    agent,
    server,
    should
};