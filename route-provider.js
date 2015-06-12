/**
 * Created by shahal on 12/06/15.
 */

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var config = require('./config');


https://maps.googleapis.com/maps/api/directions/json?
// origin=Boston,MA&
// destination=Concord,MA&
// waypoints=Charlestown,MA|Lexington,MA
