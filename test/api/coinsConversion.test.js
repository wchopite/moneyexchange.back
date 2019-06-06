// Dependencies
const expect = require('chai').expect;
const request = require('supertest');
const DB = require('../../dbManager/index');
const ConversionModel = require('../../modules/coinsConversion/conversionModel');
const CoinModel = require('../../modules/coins/coinModel');

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
    date: new Date()
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
});
