/**
 * Created by shahal on 12/06/15.
 */

function Story(markers, polyline) {
    this.markers = markers;
    this.polyline = polyline;

    this.prologue = 'Hello, Special Agent Elad. This is lieutenant Arela from the Peace Corps. We just got an anonymous tip that Mr. W, the one from that case you work on, who died several days ago, swallowed a note with a clue, regarding an act of terror that is about to happen soon. Very soon. You have to go to {0} right away!';
    this.epilogue = "Good job Special Agent Elad! You helped us avoid a potentially tremendous incident. The country can sleep well tonight.";

    var stories = [
        "Well done! I see the note is encrypted. I’ll send it to our best analysts. In the meanwhile, keep a low profile, blend in, and go grab a beer at the nearest bar. Let me find it for you… Got it, it’s {1}.",
        "I hope your beer was ice cold, because our analysts decrypted the message and I have some really bad news. The note was talking about a kidnapping. A child kidnapping. A small group of terrorists from Al-Kaida are going to kidnap Prime Minister’s son at {2}! Get there as soon as possible and stop this madness!",
        "Good! Let’s search for him. Does anyone look suspicious? There! There he is! The one with the black coat. They shoved the poor child into a black van! They’re heading towards {3}! You have to get there as soon as possible! Go!",
        "There, they stopped. Our guy just got out of the van without the child. They keep driving, and that’s exactly what we wanted. Our forces will get them very shortly, but right now you’re the only one that can prevent this lunatic from executing the next step of his plan. Follow him and catch him."
    ];

    for(var index in this.markers) {
        var currentMarker = this.markers[index];

        currentMarker.stories = [stories[index]];
    }
}



module.exports = Story;