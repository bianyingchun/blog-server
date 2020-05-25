const util = {};
const crypto = require("crypto");
const geoip = require("geoip-lite");
util.parseIp = (req) => {
  var ip =
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    "";
  if (ip.split(",").length > 0) {
    ip = ip.split(",")[0];
  }
  ip = ip.substr(ip.lastIndexOf(":") + 1, ip.length);
  ip = ip === "1" ? "112.65.1.79" : ip;
  const ip_location = geoip.lookup(ip);
  const result = { ip: ip };
  if (ip_location) {
    result.city = ip_location.city;
    result.range = ip_location.range;
    result.country = ip_location.country;
    if (Array.isArray(result.range)) {
      result.range = result.range.join(",");
    }
  }
  return result;
};

util.md5Pwd = (pwd) => crypto.createHash("md5").update(pwd).digest("hex");
module.exports = util;
