// Dependencies
const { expect } = require('chai');
const request = require('supertest');
const DB = require('../../dbManager/index');
const CoinModel = require('../../modules/coins/coinModel');

describe('Coins', () => {
  let server;

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

  describe('GET /api/coins', () => {
    const coin = {
      name: "USA Dolar",
      description: "USA Dolar",
      code: "USD",
      symbol: "$"
    };

    beforeEach(async () => {
      return await new CoinModel(coin).save();
    });

    afterEach(async () => {
      return await CoinModel.deleteMany({});
    });

    it('Should return all coins registered', (done) => {
      request(server)
        .get('/api/coins')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          const body = res.body;
          expect(body).to.be.an('array');
        })
        .end(done);
    });
  });
});
