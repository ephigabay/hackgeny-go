var express = require('express');
var locationProvider = require('./lib/location-provider');
var directionProvider = require('./lib/direction-provider');
var Point = require('./classes/Point');
var config = require('./config/index');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/api/story', function(request, response) {
    var currentLocation = new Point({geometry: {location: {lat: 32.264506, lng: 34.876531}}});
    var distance = 3500;
    locationProvider.getNearByMarkers(currentLocation, distance)
        .then(function(items) {
            if(items.length > config.maxPoints) {
                items = items.slice(0, config.maxPoints);
            }
            return Point.findShortestRoute(items, currentLocation, distance);
        })
        .then(function(route) {
            return Point.optimizeRoute(route, currentLocation, distance);
        })
        .then(function(bestRoute) {
            console.log("Best route is: " + bestRoute.distance + " meters");
            return directionProvider.getRouteDirections(currentLocation, bestRoute.permutation)
        })
        .then(function(routeDirections) {
            response.send(routeDirections);
        });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
