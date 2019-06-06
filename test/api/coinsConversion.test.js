// Dependencies
const expect = require('chai').expect;
const request = require('supertest');
const bcrypt = require('bcrypt');
const DB = require('../../dbManager/index');
const ConversionModel = require('../../modules/coinsConversion/conversionModel');
const CoinModel = require('../../modules/coins/coinModel');
const UserModel = require('../../modules/users/userModel');
const userManager = require('../../modules/users/userManager');

describe('Coins Conversion', () => {
  let server;
  const USD = {
    name: "USA Dolar",
    description: "USA Dolar",
    code: "USD",
    symbol: "$"
  };

  const EUR = {
    name: "Euro",
    description: "Euro",
    code: "EUR",
    symbol: "€"
  };

  const data = {
    "value": 200,
    "base": "USD",
    "to": "EUR"
  };

  const conversion = {
    "base": "USD",
    "to": "EUR",
    "conversionFactor": 0.88,
    "date": new Date()
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

  describe('POST /api/conversions', () => {
    beforeEach((done) => {
      Promise.all([
        new CoinModel(USD).save(),
        new CoinModel(EUR).save(),
        new ConversionModel(conversion).save()
      ]).then(() => done());
    });

    afterEach((done) => {
      Promise.all([
        CoinModel.deleteMany({}),
        ConversionModel.deleteMany({})
      ]).then(() => done());
    });

    it('Should convert 200 USD to EUR', (done) => {
      request(server)
        .post('/api/conversions')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          const body = res.body;
          expect(body).to.be.an('object');
          expect(body).to.have.property('result', 176);
        })
        .end(done);
    });
  });

  describe('PUT /api/conversions', () => {
    const newConversionFactor = 0.90;
    const newConversion = {
      "base": conversion.base,
      "to": conversion.to,
      "conversionFactor": newConversionFactor
    };

    const password = '123456';
    const user = new UserModel({
      email: 'admin@example.com'
    });

    before(async () => {
      user.password = await bcrypt.hash(password, 10)
      return await user.save();
    });

    after((done) => {
      Promise.all([
        UserModel.deleteOne({ email: user.email }),
        ConversionModel.deleteMany({})
      ]).then(() => done());
    });

    it('Try to set new base of change should be return 401', (done) => {
      request(server)
        .put('/api/conversions')
        .send(newConversion)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(done);
    });

    it('Set new base of change using authenticated user', (done) => {
      userManager.login({
        email: user.email,
        password
      }).then(({token}) => {
        request(server)
          .put('/api/conversions')
          .set('Content-Type', 'application/json')
          .set('Authorization', `bearer ${token}`)
          .send(newConversion)
          .expect('Content-Type', /json/)
          .expect(200)
          .expect((res) => {
            const body = res.body;
            expect(body).to.be.an('object');
            expect(body).to.have.property('base', 'USD');
            expect(body).to.have.property('to', 'EUR');
            expect(body).to.have.property('conversionFactor', newConversionFactor);
          })
          .end(done);
      });
    });
  });
});
