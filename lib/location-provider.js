/**
 * Created by shahal on 12/06/15.
 */

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var config = require('./../config/index');

var supportedLocationTypes = [
    'cemetery',
    'school',
    'police',
    'city_hall',
    'park',
    'museum',
    'church',
    'synagogue',
    'embassy'
];

/**
 * Returns a promise that resolves with locations near by.
 * @param currentLocation {object} - represents the current location
 * of the user.
 * @param distance - The distance that the user would like to run.
 */
module.exports = function(currentLocation, distance) {
    var query = {
        url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?',
        qs: {
            location: currentLocation.lat + ',' + currentLocation.lng,
            radius: distance / Math.PI,
            types: supportedLocationTypes.join('|'),
            key: config.googleAPIKey
        }
    };

    return request(query)
        .then(function(res) {
            return JSON.parse(res[0].body).results;
        });
};

