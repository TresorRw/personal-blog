const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
var httpMock = require('node-mocks-http');
var request = {}, response = {};
const { authUser, allowUser } = require('../middleware/userStatus');
const { app } = require('../app');
chai.use(chaiHttp);
// Checking user permission
describe('User Permissions', () => {
    context('Valid token passed', () => {
        beforeEach((done) => {
            request = httpMock.createRequest({
                method: "POST",
                url: '/savePost',
                cookies: {
                    pbtkn: "ds"
                }
            });
            response = httpMock.createResponse();
            done();
        });
        it('UserRole', (done) => {
            authUser(request, response, (error) => {
                return { response, request, error };
            });
            done();
        });
    });
    context('User actions', () => {
        beforeEach((done) => {
            request = httpMock.createRequest({
                method: "POST",
                url: '/like'
            });
            response = httpMock.createResponse();
            done();
        })
        it('Check like and comment permissions', (done) => {
            allowUser(request, response, (error) => {
                if (error) {
                    return done(error);
                } else {
                    console.log('Hello');
                }
            })
            done();
        })
    })
});

