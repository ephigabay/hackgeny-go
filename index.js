/*global require*/

var express = require('express');
var locationProvider = require('./lib/location-provider');
var directionProvider = require('./lib/direction-provider');
var Point = require('./classes/Point');
var Route = require('./classes/Route');
var config = require('./config/index');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/api/story', function(request, response) {
    var currentLocation = new Point({geometry: {location: {lat: 32.264506, lng: 34.876531}}});
    var optimalDistance = 3500;
    locationProvider.getNearByMarkers(currentLocation, optimalDistance)
        .then(function(markers) {
            if(markers.length > config.maxPoints) {
                markers = markers.slice(0, config.maxPoints);
            }
            return Route.findShortestRoute(markers, currentLocation, optimalDistance);
        })
        .then(function(route) {
            return route.optimizeRoute(currentLocation, optimalDistance);
        })
        .then(function(bestRoute) {
            console.log("Best route is: " + bestRoute.distance + " meters");
            return directionProvider.getRouteDirections(currentLocation, bestRoute.route);
        })
        .then(function(routeDirections) {
            response.send(routeDirections);
        });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
