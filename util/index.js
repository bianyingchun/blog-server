const util = {};
const geoip = require('geoip-lite');
util.parseIp = (req) => {
    const ip = (
        req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress ||
        req.ip ||
        req.ips[0]).replace('::ffff:', '') || '14.215.177.38';
    const ip_location = geoip.lookup(ip);
    const result = { ip: ip };
    if (ip_location) {
        result.city = ip_location.city;
        result.range = ip_location.range;
        result.country = ip_location.country;
        if (Array.isArray(result.range)) {
            result.range = result.range.join(',');
        }
    }
    return result;
};

util.check_params = (ctx, params) => {
    
}
module.exports = util;