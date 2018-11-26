require('./config/config.js');
const express = require('express');
const dns = require('dns');
const validator = require('validator');
const app = express();
const port = process.env.PORT || 3000;
var listOfSites = {};

app.post('/api/shorturl/new', (req, res) => {
  const url = res.body['original_url'];
  const isURL = validator.isURL(url);

  if(!isURL){
      return res.status(400).send({
          "error": "invalid URL"
      });
  }

  return dns.lookup(url, (err, address, family) => {
      if(err){
          console.log('Something went wrong with the URL.');
      }
  });

  
});

app.listen(port, () => {
    console.log(`Server started up on port ${port}`);
});