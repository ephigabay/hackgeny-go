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
 * @param route {Point[]} - An array of markers
 */
module.exports.getRouteDirections = function (currentLocation, route) {
    console.log("sending " + route.route.length + " markers");
    var query = {
        url: 'https://maps.googleapis.com/maps/api/directions/json',
        qs: {
            origin: currentLocation.getCoordinates(),
            destination: route.route[route.route.length - 1].getCoordinates(),
            waypoints: route.route.slice(0, -1).map(function (marker) {
                return marker.getCoordinates();
            }).join('|'),
            mode: MODE,
            key: config.googleAPIKey
        }
    };

    return request(query)
        .then(function (res) {
            var results = JSON.parse(res[0].body).routes[0];
            route.route.forEach(function(point, index) {
                point.distanceFromPrev = results.legs[index].distance.value;
            });
            return {
                polyline: results.overview_polyline,
                route: route
            }
        });
};

