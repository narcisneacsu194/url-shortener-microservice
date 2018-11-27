require('./config/config.js');
const express = require('express');
const dns = require('dns');
const validator = require('validator');
const bodyParser = require('body-parser');
const parse = require('url-parse');
require('./db/mongoose');
const { Url } = require('./models/url');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/shorturl/new', (req, res) => {
  const url = req.body.original_url;
  const isURL = validator.isURL(url);

  if (!isURL) {
    return res.status(400).send({
      error: 'invalid URL'
    });
  }

  let newUrl = parse(url, true);

  return dns.lookup(newUrl.hostname, (err, address, family) => {
    if (err) {
      return res.status(400).send({
        error: 'invalid Hostname'
      });
    }

    return Url.findOne({
      originalUrl: url
    }).then((dbUrl) => {
      if (dbUrl) {
        return res.send(dbUrl);
      }

      return Url.find().sort('-shortUrl').limit(1);
    }).then((maxUrlArr) => {
      if (!(maxUrlArr instanceof Array)) return;

      if (maxUrlArr.length === 0) {
        newUrl = new Url({
          originalUrl: url,
          shortUrl: 1
        });
      } else {
        let maxShortUrl = maxUrlArr[0].shortUrl;
        maxShortUrl += 1;
        newUrl = new Url({
          originalUrl: url,
          shortUrl: maxShortUrl
        });
      }

        return newUrl.save();
    }).then((doc) => {
      if (!doc) return;
      res.send(doc);
    })
      .catch((error) => {
        res.status(400).send(error);
      });
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  const { id } = req.params;
  Url.findOne({ shortUrl: id }).then((url) => {
    if (!url) {
      return res.status(404).send({
        error: 'No short url found for given input'
      });
    }
    return res.redirect(url.originalUrl);
  }).catch((err) => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Server started up on port ${port}`);
});

module.exports = { app };
