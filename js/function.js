/**
 * equates function: helps with the comparison of two arrays
 * comes from http://...
 */
if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
Array.prototype.equals = function (array) {
    if (!array)
        return false;

    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
};

Object.defineProperty(Array.prototype, "equals", {enumerable: false});

/**
 * shuffle function:
 * comes from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
if (Array.prototype.shuffle)
    console.warn("Overriding existing Array.prototype.shuffle. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
Array.prototype.shuffle = function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

Object.defineProperty(Array.prototype, "shuffle", {enumerable: false});

var arraySwap = function (a, e, f) {
    var b = a[e];
    a[e] = a[f];
    a[f] = b;
};

var dataModel = function () {

    var self = this;

    self.initialVector = [];
    for (var i = 1; i <= 15; i++) {
        self.initialVector.push(i);
    }
    self.initialVector.push(null);

    self.currentVector = self.initialVector.slice(0);
    self.shuffleVector = function () {
        self.currentVector.shuffle(self.currentVector);
    };

    self.aMove = function (e) {
        // test if e has a null neighbour
        if (e == null) {
            return;
        }
        var j = self.currentVector.indexOf(e);
        var n = self.currentVector.indexOf(null);
        if (self.currentVector[j + 1] == null && !([3, 7, 11, 15].includes(j))) {
            arraySwap(self.currentVector, j, n);
            return;
        }
        if (self.currentVector[j - 1] == null && !([0, 4, 8, 12].includes(j))) {
            arraySwap(self.currentVector, j, n);
            return;
        }
        if (self.currentVector[j + 4] == null && !([12, 13, 14, 15].includes(j))) {
            arraySwap(self.currentVector, j, n);
            return;
        }
        if (self.currentVector[j - 4] == null && !([0, 1, 2, 3].includes(j))) {
            arraySwap(self.currentVector, j, n);
        }
    };

};

var viewModel = function () {

    var self = this;

    self.count = ko.observable(0);

    self.currentVectorView = ko.observableArray(data.initialVector);

    self.resetClick = function () {
        self.count(0);
        data.shuffleVector();
        self.currentVectorView(data.currentVector);
        $('.flex-child').css('background', 'tomato');
    };

    var win = function () {
        $('.flex-child').css('background', 'green');
    };

    self.tileClick = function (d, e) {
        self.count(self.count() + 1);
        data.aMove(d);
        self.currentVectorView(data.currentVector);
        if (self.currentVectorView().equals(data.initialVector)) {
            win();
        }
    };

    self.computeID = function (n) {
        return 'tile' + n;
    }

};

var data = new dataModel();

ko.applyBindings(new viewModel());