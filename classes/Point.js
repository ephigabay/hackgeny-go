/**
 * Created by ephi on 12/06/15.
 */
function Point(point) {
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
    return R * c;
}

// Converts numeric degrees to radians
function toRad(Value)
{
    return Value * Math.PI / 180;
}

module.exports = Point;