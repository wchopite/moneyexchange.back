// Dependencies
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const DB = require('../../dbManager/index');

// Import the coinsModel
require('../../modules/coins/coinsModel');
const CoinsModel = mongoose.model('Coins');

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
      return await new CoinsModel(coin).save();
    });

    afterEach(async () => {
      return await CoinsModel.deleteMany({});
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
