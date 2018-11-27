const { Url } = require('../../models/url');

const urls = [
    {
        originalUrl: 'https://www.google.com',
        shortUrl: 1
    },
    {
        originalUrl: 'https://www.youtube.com',
        shortUrl: 2
    }
];

const populateUrls = (done) => {
    Url.remove({}).then(() => {
        return Url.insertMany(urls);
    }).then(() => done());
};

module.exports = { populateUrls };