/**
 * Created by ephi on 12/06/15.
 */
/*global require,module*/

function Point(point) {

    point = point || {};

    this.geometry = point.geometry;
    this.icon = point.icon;
    this.name = point.name;
    this.types = point.types;
    this.vicinity = point.vicinity;
    //this.place_id = point.place_id;
    //this.reference = point.reference;
    //this.id = point.id;
    //this.scope = point.scope;

    if(this.name) {
        this._fixMarkerName();
    }
}

Point.prototype.getDistanceFrom = function (point) {
    return calcCrow(
        this.geometry.location.lat, this.geometry.location.lng,
        point.geometry.location.lat, point.geometry.location.lng);
};

Point.prototype.getCoordinates = function () {
    return this.geometry.location.lat + ',' + this.geometry.location.lng;
};

Point.prototype._fixMarkerName = function() {
    this.name = this.name.replace(/-/g, ' ').replace(/[^a-z0-9 ,\.]/gi, '').trim();
    if(!this.name) {
        this.name = this.vicinity;
    }
};

/* Stuff from the interwebs */

function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}

module.exports = Point;