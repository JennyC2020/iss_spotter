
const request = require('request');

// iss.js
/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */

const fetchMyIP = (callback) => {
  // use request to fetch IP address from JSON API

  request('https://api.ipify.org?format=json', (error, resp, body) => {

    if (error) return callback(error, null);

    if (resp.statusCode !== 200) {
      callback(Error(`Status Code ${resp.statusCode} when fetching IP. Response: ${body}`), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);

  });
};




const fetchCoordsByIP = (ip, callback) => {
  request(`https://ipvigilante.com/${ip}`, (error, resp, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (resp.statusCode !== 200) {
      callback(Error(`Status Code ${resp.statusCode} when fetching coordinates for IP. Response: ${body}`), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body).data;

    callback(null, { latitude, longitude });

  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };