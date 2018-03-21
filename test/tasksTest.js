// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const agent = chai.request.agent(server);
const should = chai.should();

chai.use(chaiHttp);