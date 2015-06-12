/**
 * Created by ephi on 12/06/15.
 */
var methods = {};
methods.permute = function(input) {
    var i, ch;
    for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (input.length == 0) {
            permArr.push(usedChars.slice());
        }
        methods.permute(input);
        input.splice(i, 0, ch);
        usedChars.pop();
    }
    return permArr
};

var permArr = [],
    usedChars = [];

module.exports = methods;