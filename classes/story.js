/**
 * Created by shahal on 12/06/15.
 */

function Story(markers, polyline) {
    this.markers = markers;
    this.polyline = polyline;

    this.prologue = parseMarker('Hello, Special Agent Elad. This is lieutenant Arela from the Peace Corps. We just got an anonymous tip that our agent that was murdered a few days ago, has left a message on his body for us, regarding an act of terror that will happen soon. Very soon. You have to go to {MARKER} right away!', this.markers[0]);

    var stories = [
        'Well done! I see the note is encrypted. I’ll send it to our best analysts. In the meantime, keep a low profile, and go grab a beer at the nearest bar. Let me find it for you… Got it. it’s {MARKER}.',
        'I hope your beer was ice cold, because our analysts decrypted the message and I have some really bad news. The note was talking about a kidnapping. A child kidnapping. A small group of terrorists are going to kidnap Prime Minister’s son at {MARKER}! Get there and stop this madness!',
        'Good! Let’s search for him. Does anyone look suspicious? There! There he is! The one with the black coat. They shoved the poor child into a black van! They’re heading towards {MARKER}! You have to get there now!',
        'There, they stopped, and our guy just got out of the vehicle without the child. He’s running. You go after him, and we’ll take care of the van and save the child! You have to get him before something terrible happens!',

        // This one is the epilogue and should be retrieved from a list of epilogues in the future
        'Good job Special Agent Elad! You helped us avoid a potentially tremendous incident. The country can sleep well tonight.'
    ];

    for(var index = 0; index < this.markers.length; index++) {
        var currentMarker = this.markers[index];
        currentMarker.stories = [parseMarker(stories[index], this.markers[index+1])];

        currentMarker.countdown = 10000;
    }
}

function parseMarker(story, nextMarker) {
    if(!nextMarker) {
        return story;
    }

    return story.replace(/\{MARKER\}/g, nextMarker.name);
}


module.exports = Story;