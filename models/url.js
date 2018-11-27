const mongoose = require('mongoose');
const _ = require('lodash');

const UrlSchema = mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: Number,
    required: true
  }
});

function toJSON() {
  const url = this;
  const urlObject = url.toObject();
  return _.pick(urlObject, ['originalUrl', 'shortUrl']);
}

UrlSchema.methods.toJSON = toJSON;

const Url = mongoose.model('Url', UrlSchema);

module.exports = { Url };
