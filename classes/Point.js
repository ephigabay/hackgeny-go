/**
 * Created by ephi on 12/06/15.
 */
/*global require*/
var arrayStuff = require('../lib/array-stuff');

function Point(point) {

   point = point || {};

    this.geometry = point.geometry;
    this.icon = point.icon;
    this.id = point.id;
    this.name = point.name;
    this.place_id = point.place_id;
    this.reference = point.reference;
    this.scope = point.scope;
    this.types = point.types;
    this.vicinity = point.vicinity;
}

Point.prototype.getDistanceFrom = function(point) {
    return calcCrow(
        this.geometry.location.lat, this.geometry.location.lng,
        point.geometry.location.lat, point.geometry.location.lng);
};

Point.findShortestRoute = function(pointsArray, currentLocation, optimalDistance) {
    console.log("calculating permutations");
    var permutations = arrayStuff.permute(pointsArray);
    console.log("finished calculating permutations");
    return permutations.reduce(function(p, c) {
        var distance = Point.getRouteDistance(c);
        if(!p || Math.abs(distance - optimalDistance) < Math.abs(p.distance - optimalDistance)) {
            p = {
                permutation: c,
                distance: distance
            }
        }
        return p;
    }, null);
};

Point.getRouteDistance = function(route, currentLocation) {
    var distance = 0;
    distance += currentLocation.getDistanceFrom(route[0]);
    for(var i = 0; i < route.length - 1; i++) {
        distance += route[i].getDistanceFrom(route[i+1]);
    }
    distance += route[i].getDistanceFrom(currentLocation);
    return distance;
};

Point.optimalizeRoute = function(permutation, currentLocation, optimalDistance) {
    while(permutation.distance > optimalDistance) {
        permutation.pop();
        permutation.distance = Point.getRouteDistance(permutation.permutation);
    }
    return permutation;
};

function calcCrow(lat1, lon1, lat2, lon2)
{
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000;
}

// Converts numeric degrees to radians
function toRad(Value)
{
    return Value * Math.PI / 180;
}

module.exports = Point;