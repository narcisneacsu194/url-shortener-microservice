const expect = require('expect');
const request = require('supertest');
const { app } = require('../server');
const { Url } = require('../models/url');
const { populateUrls } = require('./database/populateDatabase');

beforeEach(populateUrls);

describe('POST /api/shorturl/new', () => {
  it('should register new inserted url, together with a unique id', (done) => {
    const body = {
      original_url: 'https://www.github.com'
    };

    request(app)
      .post('/api/shorturl/new')
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.originalUrl).toBe(body.original_url);
        expect(res.body.shortUrl).toBe(3);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        return Url.findOne({
          originalUrl: body.original_url,
          shortUrl: 3
        }).then((dbUrl) => {
          expect(dbUrl.originalUrl).toBe(body.original_url);
          expect(dbUrl.shortUrl).toBe(3);
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });

  it('should return invalid url message', (done) => {
    const body = {
      original_url: 'gibberish'
    };
    request(app)
      .post('/api/shorturl/new')
      .send(body)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('invalid URL');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        return Url.findOne({
          originalUrl: body.original_url,
          shortUrl: 3
        }).then((dbUrl) => {
          expect(dbUrl).toBeFalsy();
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });

  it('should return invalid hostname message', (done) => {
    const body = {
      original_url: 'https://www.i23jroei2jr.com'
    };

    request(app)
      .post('/api/shorturl/new')
      .send(body)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('invalid Hostname');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        return Url.findOne({
          originalUrl: body.original_url,
          shortUrl: 3
        }).then((dbUrl) => {
          expect(dbUrl).toBeFalsy();
          done();
        }).catch(error => done(error));
      });
  });
});

describe('/api/shorturl/:id', () => {
  it('should redirect the user to the specific site', (done) => {
    const location = 'https://www.youtube.com';
    const text = 'Found. Redirecting to https://www.youtube.com';
    request(app)
      .get('/api/shorturl/2')
      .expect(302)
      .expect((res) => {
        expect(res.headers.location).toBe(location);
        expect(res.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        return Url.findOne({
          shortUrl: 2
        }).then((dbUrl) => {
          expect(dbUrl.originalUrl).toBe(location);
          expect(dbUrl.shortUrl).toBe(2);
          done();
        }).catch(error => done(error));
      });
  });

  it('should return no short url found message', (done) => {
    request(app)
      .get('/api/shorturl/123')
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('No short url found for given input');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        return Url.findOne({
          shortUrl: 123
        }).then((dbUrl) => {
          expect(dbUrl).toBeFalsy();
          done();
        }).catch(error => done(error));
      });
  });
});
