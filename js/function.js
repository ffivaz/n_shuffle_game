/**
 * equates function: helps with the comparison of two arrays
 * comes from http://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
 */
if (Array.prototype.equals) {
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
}
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
if (Array.prototype.shuffle) {
    console.warn("Overriding existing Array.prototype.shuffle. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
}
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

    self.correctVector = [];
    for (var j = 0; j < 16; j++) {
        self.correctVector.push(0);
    }

    self.currentVector = self.initialVector.slice(0);
    self.shuffleVector = function () {
        self.currentVector.shuffle(self.currentVector);
    };

    self.aMove = function (e) {
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

    self.checkCorrectTiles = function () {
        for (var k = 0; k < self.correctVector.length; k++) {
            if (self.currentVector[k] == self.initialVector[k]) {
                self.correctVector[k] = 1;
            } else {
                self.correctVector[k] = 0;
            }
        }
    };

    if (typeof window.localStorage != "undefined") {
        self.storeData = true;
        self.bestScores = JSON.parse(localStorage.getItem("best scores"));
        if (self.bestScores == null) {
            self.bestScores = [500, 499, 498, 497, 496];
            window.localStorage.setItem("best scores", JSON.stringify(self.bestScores));
        }
        /*self.bestTimes = JSON.parse(localStorage.getItem("best times"));
         if (self.bestTimes == null) {
         self.bestTimes = ["1:00:00", "1:00:00", "1:00:00", "1:00:00", "1:00:00"];
         window.localStorage.setItem("best times", JSON.stringify(self.bestTimes));
         }*/
    } else {
        console.log("localStorage not supported. Scores will not be stored.");
        self.storeData = false;
    }

    self.checkScore = function (s) {
        var isBest = 5;
        var j = 4;
        while (j >= 0) {
            if (self.bestScores[j] > s) {
                isBest = self.bestScores.indexOf(self.bestScores[j]);
            }
            j--;
        }
        if (isBest == 5) {
            console.log("No best score, try again!");
            return;
        } else {
            console.log("with a score of " + s + ", you logged the " + (isBest + 1) + "th best score");
        }
        var i = 4;
        while (i > isBest) {
            self.bestScores[i] = self.bestScores[i - 1];
            i--;
        }
        self.bestScores[isBest] = s;

        window.localStorage.setItem("best scores", JSON.stringify(self.bestScores));
    };

};

var viewModel = function () {

    $("#over").hide();
    $("#scores").hide();

    var self = this;

    var timer = new Timer();
    timer.addEventListener("secondsUpdated", function (e) {
        $("#elapsed").html("Time: " + timer.getTimeValues().toString());
    });

    self.winText = ko.observable("WELL DONE!");
    self.started = ko.observable(0);
    self.count = ko.observable(0);
    self.countText = ko.computed(function () {
        return "Count: " + self.count();
    });
    self.currentVectorView = ko.observableArray(data.initialVector);
    data.checkCorrectTiles();
    self.correctVectorView = ko.observableArray(data.correctVector);
    self.bestScoresView = ko.observableArray(data.bestScores);
    self.bestTimesView = ko.observableArray(data.bestTimes);
    self.buttonText = ko.observable("Start");

    if (data.storeData == false) {
        $("#scoresBtn").hide();
    }

    self.buttonClick = function () {
        self.started(1);
        self.buttonText("Restart");
        self.count(0);
        data.shuffleVector();
        self.currentVectorView(data.currentVector);
        data.checkCorrectTiles();
        self.correctVectorView(data.correctVector);
        timer.stop();
        timer.start();
        $("#over").hide();
    };

    self.scoresClick = function () {
        if ($("#scoresBtn").html() == "Scores") {
            $("#resetBtn").hide();
            $("#scores").show();
            $("#scoresBtn").html("Close");
        } else {
            $("#resetBtn").show();
            $("#scores").hide();
            $("#scoresBtn").html("Scores");
        }
    };

    var win = function () {
        timer.stop();
        self.buttonText("Restart");
        data.checkScore(self.count());
        self.bestScoresView(data.bestScores);
        $("#over").show();
    };

    self.tileClick = function (d) {
        self.count(self.count() + 1);
        data.aMove(d);
        self.currentVectorView(data.currentVector);
        data.checkCorrectTiles();
        self.correctVectorView(data.correctVector);
        if (self.currentVectorView().equals(data.initialVector)) {
            win();
        }
    };

};

var data = new dataModel();

ko.applyBindings(new viewModel());
