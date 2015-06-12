/**
 * Created by shahal on 12/06/15.
 */

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var config = require('./../config/index');

// The only supported mode is walking for now.
var MODE = 'walking';

/**
 * Returns directions from Google Directions API, according to
 * the markers provided.
 * @param currentLocation {Point}
 * @param markers {Point[]} - An array of markers
 */
module.exports.getRouteDirections = function(currentLocation, markers) {
    var query = {
        url: 'https://maps.googleapis.com/maps/api/directions/json',
        qs: {
            origin: currentLocation.geometry.location.lat + ',' + currentLocation.geometry.location.lng,
            destination: currentLocation.geometry.location.lat + ',' + currentLocation.geometry.location.lng,
            waypoints: markers.map(function(marker) {
                return marker.name
            }).join('|'),
            mode: MODE,
            key: config.googleAPIKey
        }
    };

    request(query)
        .then(function(res) {
            return {
                polyline: JSON.parse(res[0].body).routes[0].overview_polyline
            };
        });
};

//module.exports({ lat: 32.264506, lng: 34.876531 }, 2000);