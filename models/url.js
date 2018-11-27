var mongoose = require('mongoose');
var _ = require('lodash');
var UrlSchema = mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: Number,
        required: true
    }
});

UrlSchema.methods.toJSON = function(){
    var url = this;
    var urlObject = url.toObject();

    return _.pick(urlObject, ['originalUrl', 'shortUrl']);
};

var Url = mongoose.model('Url', UrlSchema);

module.exports = { Url };