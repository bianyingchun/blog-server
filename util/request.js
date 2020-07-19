const request = require('request');

const get = (url, qs = {}) => {
    return new Promise((resolve, reject) => {
        request.get({ url, qs: qs, json: true }, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(err);
            }
        });
    });
};

module.exports = {
    get
};