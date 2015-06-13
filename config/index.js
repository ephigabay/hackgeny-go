/**
 * Created by shahal on 12/06/15.
 */
// KMPH = kilometer per hour
// MPMS = meter per milisecond
var KMPH_TO_MPMS = 1000 / 3600000;

module.exports = {
    googleAPIKey: 'AIzaSyAa15kIWFqQw1RRqwX4gfPV1HvQpGd5pz0',
    maxPoints: 8,
    optimalDistanceThreshold: 500,
    presentationTimeout: 200, // milliseconds
    env: 'presentation',
    //env: 'development',
    speeds: {
        easy: 5 * KMPH_TO_MPMS,
        medium: 10 * KMPH_TO_MPMS,
        hard: 15 * KMPH_TO_MPMS
    }
};