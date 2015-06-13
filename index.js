/*global require*/

var express = require('express');
var bodyParser = require('body-parser');
var locationProvider = require('./lib/location-provider');
var directionProvider = require('./lib/direction-provider');
var Point = require('./classes/point');
var Route = require('./classes/route');
var Story = require('./classes/story');
var config = require('./config/index');
var app = express();

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

// This cached version will be returned to the user in case an exception is raised.
var CACHED_STORY = {
    "markers": [{
        "geometry": {"location": {"lat": 32.25626, "lng": 34.871856}},
        "icon": "http://maps.gstatic.com/mapfiles/place_api/icons/gas_station-71.png",
        "name": "Tel Yitshak Cemetery",
        "types": ["cemetery", "gas_station", "establishment"],
        "vicinity": "Beit Yehoshua",
        "stories": ["Well done! I see the note is encrypted. I’ll send it to our best analysts. In the meantime, keep a low profile, and go grab a beer at the nearest bar. Let me find it for you… Got it. it’s Laura Studio Latino."]
    }, {
        "geometry": {"location": {"lat": 32.257286, "lng": 34.868927}},
        "icon": "http://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png",
        "name": "Laura Studio Latino",
        "types": ["night_club", "school", "establishment"],
        "vicinity": "Ha-Kharuv Street 6, Beit Yehoshua",
        "stories": ["I hope your beer was ice cold, because our analysts decrypted the message and I have some really bad news. The note was talking about a kidnapping. A child kidnapping. A small group of terrorists are going to kidnap Prime Minister’s son at Harimon Street, Beit Yehoshua! Get there and stop this madness!"]
    }, {
        "geometry": {"location": {"lat": 32.257387, "lng": 34.868266}},
        "icon": "http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png",
        "name": "Harimon Street, Beit Yehoshua",
        "types": ["school", "establishment"],
        "vicinity": "Harimon Street, Beit Yehoshua",
        "stories": ["Good! Let’s search for him. Does anyone look suspicious? There! There he is! The one with the black coat. They shoved the poor child into a black van! They’re heading towards Even Yehuda Cemetery! You have to get there now!"]
    }, {
        "geometry": {"location": {"lat": 32.26575, "lng": 34.8719}},
        "icon": "http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png",
        "name": "Even Yehuda Cemetery",
        "types": ["cemetery", "establishment"],
        "vicinity": "Even Yehuda",
        "stories": ["There, they stopped, and our guy just got out of the vehicle without the child. He’s running. You go after him, and we’ll take care of the van and save the child! You have to get him before something terrible happens!"]
    }],
    "polyline": {"points": "gt|cEiwzsEpCANEFODqBR_AFyFEeEAm@nA?nE?`F@jOFbEB~GCp@?JJLb@D`@QlDCfAAnFDxCLtLU^MFOBk@G[?SDINCj@DnEFVNHN@FDFN?`@Iv@Ah@FTTJHJHXBxD@`FCzDsAIQKGW?[u@BgAGOGGQAc@BeAa@?SAuAEk@EE`@Kl@I^Q^g@`AsA|BPLL?HELQRs@d@{@JMNIHCP?p@H^LNHOI_@MYEi@CIBOHKLe@z@Sr@MPQDWMn@gAeE}Bu@zByBmAuAu@{CaBiDiBi@a@k@YYEQBq@EyACsCHcA@IGCMCeDCeI{AAc@?b@?zA@C_U@yAb@@`@@F@HF^D"},
    "prologue": "Hello, Special Agent Elad. This is lieutenant Arela from the Peace Corps. We just got an anonymous tip that our agent that was murdered a few days ago, has left a message on his body for us, regarding an act of terror that will happen soon. Very soon. You have to go to Tel Yitshak Cemetery right away!",
    "epilogue": "Good job Special Agent Elad! You helped us avoid a potentially tremendous incident. The country can sleep well tonight."
};

var storyHandlers = {
    development: function developmentCallback(request, response) {
        //request.body = {"max_distance":3500, "start_location": {"lat":32.264506, "lng":34.87658}, difficulty:'medium'};
        var currentLocation = new Point({
            name: 'End point',
            geometry: {
                location: request.body['start_location']
            },
            is_last: true
        });
        var optimalDistance = request.body['max_distance'];
        var speed = config.speeds[request.body['difficulty']];
        var route;

        locationProvider.getNearByMarkers(currentLocation, optimalDistance)
            .then(function (markers) {
                if (markers.length > config.maxPoints) {
                    markers = markers.slice(0, config.maxPoints);
                }
                return Route.findShortestRoute(markers, currentLocation, optimalDistance);
            })
            .then(function (route) {
                return route.optimizeRoute(currentLocation, optimalDistance);
            })
            .then(function (bestRoute) {
                console.log("Best route is: " + bestRoute.distance + " meters");


                // Add the current location, which is the ending point of the run as well,
                // as a marker, so it settles with the UI logic.
                bestRoute.route.push(currentLocation);

                return directionProvider.getRouteDirections(currentLocation, bestRoute);
            })
            .then(function (polylineAndRoute) {
                response.send(new Story(polylineAndRoute.route, polylineAndRoute.polyline, speed));
            })
            .catch(function (err) {
                console.dir(err);
                response.send({error: 'An error has occurred. Unable to calculate route.'});
            });
    },
    presentation: function presentationCallback(request, response) {
        setTimeout(function () {
            response.send(CACHED_STORY);
        }, config.presentationTimeout);
    }
};

app.post('/api/story', storyHandlers[config.env]);

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
