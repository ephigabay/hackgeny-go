/**
 * Created by shahal on 12/06/15.
 */

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var config = require('./../config/index');
var Point = require('../classes/Point');

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
 * @param currentLocation {Point} - represents the current location
 * of the user.
 * @param distance - The distance that the user would like to run.
 */
module.exports.getNearByMarkers = function(currentLocation, distance) {
    var query = {
        url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?',
        qs: {
            location: currentLocation.getCoordinates(),
            radius: distance / Math.PI,
            types: supportedLocationTypes.join('|'),
            key: config.googleAPIKey
        }
    };

    return request(query)
        .then(function(res) {
            return JSON.parse(res[0].body).results.map(function(point) {
                return new Point(point);
            });
        });
};

