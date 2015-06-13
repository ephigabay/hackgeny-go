/**
 * Created by ephi on 12/06/15.
 */
/*global require,module*/
var arrayStuff = require('../lib/array-stuff');
var Point = require('./point');
var config = require('../config/index');

function Route(route, distance) {
    this.route = route;
    this.distance = distance;
}

Route.findShortestRoute = function(routes, currentLocation, optimalDistance) {
    console.log("calculating permutations");
    var permutations = arrayStuff.permute(routes);
    console.log("finished calculating permutations");
    return permutations.reduce(function(p, c) {
        c = new Route(c);
        c.distance = c.getRouteDistance(currentLocation);
        if(!p || Math.abs(c.distance - optimalDistance) < Math.abs(p.distance - optimalDistance)) {
            p = c;
        }
        return p;
    }, null);
};

Route.prototype.getRouteDistance = function(currentLocation) {
    this.distance = 0;
    this.distance += currentLocation.getDistanceFrom(this.route[0]);
    for(var i = 0; i < this.route.length - 1; i++) {
        this.distance += this.route[i].getDistanceFrom(this.route[i+1]);
    }
    this.distance += this.route[i].getDistanceFrom(currentLocation);
    return this.distance;
};

Route.prototype.optimizeRoute = function(currentLocation, optimalDistance) {
    while(this.distance > (optimalDistance + config.optimalDistanceThreshold)) {
        this.route.pop();
        this.distance = this.getRouteDistance(currentLocation);
    }
    return this;
};

Route.prototype.getTotalDistance = function() {
    return this.route.reduce(function(previousValue, currentValue) {
        return previousValue + currentValue.distanceFromPrev;
    }, 0);
};

module.exports = Route;