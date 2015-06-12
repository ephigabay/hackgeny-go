/*global require*/

var express = require('express');
var locationProvider = require('./lib/location-provider');
var directionProvider = require('./lib/direction-provider');
var Point = require('./classes/point');
var Route = require('./classes/route');
var Story = require('./classes/story');
var config = require('./config/index');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// This cached version will be returned to the user in case an exception is raised.
var CACHED_STORY = {
    "markers":[
        {
            "geometry":{
                "location":{
                    "lat":32.25626,
                    "lng":34.871856
                }
            },
            "icon":"http://maps.gstatic.com/mapfiles/place_api/icons/gas_station-71.png",
            "name":"Tel Yitshak Cemetery",
            "types":[
                "cemetery",
                "gas_station",
                "establishment"
            ],
            "vicinity":"Beit Yehoshua",
            "stories":[
                "Well done! I see the note is encrypted. I’ll send it to our best analysts. In the meanwhile, keep a low profile, blend in, and go grab a beer at the nearest bar. Let me find it for you… Got it, it’s Laura Studio Latino."
            ]
        },
        {
            "geometry":{
                "location":{
                    "lat":32.257286,
                    "lng":34.868927
                }
            },
            "icon":"http://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png",
            "name":"Laura Studio Latino",
            "types":[
                "night_club",
                "school",
                "establishment"
            ],
            "vicinity":"Ha-Kharuv Street 6, Beit Yehoshua",
            "stories":[
                "I hope your beer was ice cold, because our analysts decrypted the message and I have some really bad news. The note was talking about a kidnapping. A child kidnapping. A small group of terrorists from Al-Kaida are going to kidnap Prime Minister’s son at Harimon Street, Beit Yehoshua! Get there as soon as possible and stop this madness!"
            ]
        },
        {
            "geometry":{
                "location":{
                    "lat":32.257387,
                    "lng":34.868266
                }
            },
            "icon":"http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png",
            "name":"Harimon Street, Beit Yehoshua",
            "types":[
                "school",
                "establishment"
            ],
            "vicinity":"Harimon Street, Beit Yehoshua",
            "stories":[
                "Good! Let’s search for him. Does anyone look suspicious? There! There he is! The one with the black coat. They shoved the poor child into a black van! They’re heading towards Even Yehuda Cemetery! You have to get there as soon as possible! Go!"
            ]
        },
        {
            "geometry":{
                "location":{
                    "lat":32.26575,
                    "lng":34.8719
                }
            },
            "icon":"http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png",
            "name":"Even Yehuda Cemetery",
            "types":[
                "cemetery",
                "establishment"
            ],
            "vicinity":"Even Yehuda",
            "stories":[
                "There, they stopped. Our guy just got out of the van without the child. They keep driving, and that’s exactly what we wanted. Our forces will get them very shortly, but right now you’re the only one that can prevent this lunatic from executing the next step of his plan. Follow him and catch him."
            ]
        }
    ],
    "polyline":{
        "points":"gt|cEiwzsEpCANEFODqBR_AFyFEeEAm@nA?nE?`F@jOFbEB~GCp@?JJLb@D`@QlDCfAAnFDxCLtLU^MFOBk@G[?SDINCj@DnEFVNHN@FDFN?`@Iv@Ah@FTTJHJHXBxD@`FCzDsAIQKGW?[u@BgAGOGGQAc@BeAa@?SAuAEk@EE`@Kl@I^Q^g@`AsA|BPLL?HELQRs@d@{@JMNIHCP?p@H^LNHOI_@MYEi@CIBOHKLe@z@Sr@MPQDWMn@gAeE}Bu@zByBmAuAu@{CaBiDiBi@a@k@YYEQBq@EyACsCHcA@IGCMCeDCeI{AAc@?b@?zA@C_U@yAb@@`@@F@HF^D"
    },
    "prologue":"Hello, Special Agent Elad. This is lieutenant Arela from the Peace Corps. We just got an anonymous tip that Mr. W, the one from that case you work on, who died several days ago, swallowed a note with a clue, regarding an act of terror that is about to happen soon. Very soon. You have to go to Tel Yitshak Cemetery right away!",
    "epilogue":"Good job Special Agent Elad! You helped us avoid a potentially tremendous incident. The country can sleep well tonight."
};

app.get('/api/story', function(request, response) {
    var currentLocation = new Point({geometry: {location: {lat: 32.264506, lng: 34.876531}}});
    var optimalDistance = 3500;
    var route;

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
            route = bestRoute;

            return directionProvider.getRouteDirections(currentLocation, bestRoute.route);
        })
        .then(function(polyline) {
            response.send(new Story(route.route, polyline));
        })
        .catch(function(err) {
            console.log(err);
            response.send(CACHED_STORY);
        });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
