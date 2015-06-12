var express = require('express');
var locationProvider = require('./lib/location-provider');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/api/story', function(request, response) {
    locationProvider.getNearByMarkers({lat: 32.264506, lng: 34.876531}, 2000)
        .then(function(items) {
            response.send(items);
        });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
