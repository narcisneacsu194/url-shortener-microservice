require('./config/config.js');
const express = require('express');
const dns = require('dns');
const validator = require('validator');
const app = express();
const bodyParser = require('body-parser');
const parse = require('url-parse');
const _ = require('lodash');
const port = process.env.PORT || 3000;
var siteObjectList = {};

app.use(bodyParser.json());

app.post('/api/shorturl/new', (req, res) => {
  const url = req.body['original_url'];
  const isURL = validator.isURL(url);

  if(!isURL){
      return res.status(400).send({
          "error": "invalid URL"
      });
  }

const newUrl = parse(url, true);

 dns.lookup(newUrl.hostname, (err, address, family) => {
      if(err){
          resultResult = true;
          return res.status(400).send({
              "error": "invalid Hostname"
          });
      }

      const returnedUrl = siteObjectList[url];
      if(!returnedUrl){
      let maxNum;

      let arr = Object.values(siteObjectList);
      if(arr.length === 0){
        maxNum = 0;
      }else{
        maxNum = Math.max(...arr);
      }
      

      if(maxNum === 0){
        siteObjectList = {[url]: 1}
      }else{
        let obj = {[url]: maxNum + 1};
          _.assign(siteObjectList, obj);
      }
    }
  
     res.send({
       original_url: url,
       short_url: siteObjectList[url]
     });
  });
});

app.listen(port, () => {
    console.log(`Server started up on port ${port}`);
});

module.exports = { app };