// Dependencies
const { expect } = require('chai');
const request = require('supertest');
const bcrypt = require('bcrypt');
const DB = require('../../dbManager/index');
const UserModel = require('../../modules/users/userModel');

describe('Users', () => {
  let server;
  const user = {
    email: 'admin@example.com',
    password: '123456'
  };

  before((done) => {
    DB.connect()
      .then(() => {
        done();
        server = require('../../server');
      })
      .catch((error) => done(error));
  });

  after((done) => {
    DB.close()
      .then(() => {
        done();
        server.close();
      })
      .catch((error) => done(error));
  });

  describe('POST /api/signup', () => {
    afterEach(async () => {
      return await UserModel.deleteOne({ email: user.email });
    });

    it('Signup new user', (done) => {
      request(server)
        .post('/api/signup')
        .set('Content-Type', 'application/json')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          const body = res.body;
          expect(body).to.be.an('object');
          expect(body).to.have.property('message');
        })
        .end(done);
    });
  });

  describe('POST /api/login', () => {
    beforeEach(async () => {
      let newUser = { email: user.email };
      newUser.password = await bcrypt.hash(user.password, 10);
      return await new UserModel(newUser).save();
    });

    afterEach((done) => {
      UserModel.deleteOne({ email: user.email }).then(() => done());
    });

    it('Login user successfully', (done) => {
      request(server)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          const body = res.body;
          expect(body).to.be.an('object');
          expect(body).to.have.property('token');
          expect(body).to.have.property('message');
        })
        .end(done);
    });

    it('Login not successfully - bad credentials', (done) => {
      const badUser = {
        email: user.email,
        password: '56789'
      };

      request(server)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send(badUser)
        .expect('Content-Type', /json/)
        .expect(401)
        .end(done);
    });
  });
});
