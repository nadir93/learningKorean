var spread = [];
var flip = [];
const LAST_CARD_INDEX = '9';
const ANIMATION_DURATION_TIME = 150;

// init array
for (i = 0; i < 10; i++) {
    spread.push(true);
    flip.push(false);
}

console.log("spread length = " + spread.length);

var data = require('electron').remote.getGlobal('sharedObject').hangulData;
//console.log(data);
var shuffledData = data["r"];
console.log("shuffledData=" + shuffledData);

//카드초기화
initCards(shuffledData);

document.addEventListener('keydown', (event) => {
    const keyName = event.key;

    console.log("keyName = " + keyName);
    console.log("event.keyCode = " + event.keyCode);

    if (keyName === 'Control') {
        // not alert when only Control key is pressed.
        return;
    }

    console.log("isNumber = " + isNumber(keyName));

    /**
     * indivisual card animation
     */
    if (isNumber(keyName)) {
        if (keyName === '0') {
            toggleLastCard(keyName);
        } else {
            flipCard(keyName);
        }
    }

    /**
     * spread all cards
     * @type {[type]}
     */
    if (keyName === 'j') {
        $(".card").each(function(e) {
            console.log('e = ' + e);

            if (e == LAST_CARD_INDEX) {
                flipLastCard();
            } else {
                spreadCards(e);
            }
        });

        for (i = 0; i < 10; i++) {
            spread[i] = false;
            flip[i] = false;
        }
    }

    /**
     * stack all cards
     * @type {[type]}
     */
    if (keyName === 'k') {
        stackCards();
    }

    /**
     * shuffle cards
     * @type {[type]}
     */
    if (keyName === 'l') {
        var oldKey = Object.keys(shuffledData[9]);
        console.log("oldKey = " + oldKey);
        var oldImg = shuffledData[LAST_CARD_INDEX][oldKey].image;
        console.log("oldImg = " + oldImg);

        shuffledData = shuffle(shuffledData);
        var newKey = Object.keys(shuffledData[LAST_CARD_INDEX]);
        console.log("newKey = " + newKey);
        var newImg = shuffledData[LAST_CARD_INDEX][newKey].image;
        console.log("newImg = " + newImg);

        if (oldImg == newImg) {
            console.log("이미지가 같습니다");
        } else {
            console.log("이미지가 다릅니다");
            $("#card" + LAST_CARD_INDEX + " .front")
                .html('<img src="./images/' + newImg + '" />');
        }

        stackCards();

        setTimeout(function() {
            $(".list").empty();
            //카드초기화
            initCards(shuffledData);
        }, 13 * ANIMATION_DURATION_TIME);
    }

    /**
     * exit
     * @type {[type]}
     */
    if (keyName === ';') {
        window.close();
    }

    changeChar(keyName);

}, false);

function stackCards() {
    $(".card").each(function(e) {
        //console.log('e = ' + e);
        if (e == LAST_CARD_INDEX) {
            stackLastCard();
        } else {
            stackCard(e);
        }
    });

    for (i = 0; i < 10; i++) {
        spread[i] = true;
        flip[i] = false;
    }
}

/**
 * [isNumber description]
 * @param  {[type]}  str [description]
 * @return {Boolean}     [description]
 */
function isNumber(str) {
    var pattern = /^\d+$/;
    return pattern.test(str); // returns a boolean
}

function toggleLastCard(cardIndex) {
    console.log("index = " + cardIndex);
    console.log("spread[LAST_CARD_INDEX] = " + spread[LAST_CARD_INDEX]);
    if (spread[LAST_CARD_INDEX]) {
        animation(LAST_CARD_INDEX, "card flipped", 1, ANIMATION_DURATION_TIME);
    } else {
        animation(LAST_CARD_INDEX, "card", 1, ANIMATION_DURATION_TIME);
    }
    spread[LAST_CARD_INDEX] = !spread[LAST_CARD_INDEX];
}

function toggleCard(cardIndex) {
    var index = cardIndex - 1;
    console.log("index = " + index);
    if (spread[index]) {
        animation(index, "card ani" + index, 1, ANIMATION_DURATION_TIME);
    } else {
        animation(index, "card", 1, ANIMATION_DURATION_TIME);
    }
    spread[index] = !spread[index];
}

function spreadCards(cardIndex) {
    animation(cardIndex, "card ani" + cardIndex,
        cardIndex, ANIMATION_DURATION_TIME);
}

function flipLastCard() {
    var value = $("#card" + LAST_CARD_INDEX).attr("class");
    console.log('value = ' + value);

    if (value === "card") {
        console.log("true");
        animation(LAST_CARD_INDEX, "card flipped", 12, ANIMATION_DURATION_TIME);
    }
}

function flipCard(cardIndex) {
    var value = $("#card" + cardIndex).attr("class");
    console.log('value = ' + value);

    if (flip[cardIndex - 1]) {
        animation((cardIndex - 1), "card " + "ani" + (cardIndex - 1),
            1, ANIMATION_DURATION_TIME);
    } else {
        animation((cardIndex - 1), "card flipped " + "ani" + (cardIndex - 1),
            1, ANIMATION_DURATION_TIME);
    }
    flip[cardIndex - 1] = !flip[cardIndex - 1];
}

function stackLastCard() {
    animation(LAST_CARD_INDEX, "card",
        11, ANIMATION_DURATION_TIME);
}

function stackCard(cardIndex) {
    animation(cardIndex, "card", cardIndex, ANIMATION_DURATION_TIME);
}

function animation(cardIndex, attr, delay, duration) {
    setTimeout(function() {
        $("#card" + cardIndex).attr("class", attr);

        // if (cardIndex == "10") {
        //     setTimeout(function() {
        //         $('#grid ul li:last').remove();
        //     }, 300);
        // }
    }, delay * duration);
}

function initCards(arr) {
    var cardNumber = 0;

    jQuery.each(arr, function() {
        //$("#" + this).text("My id is " + this + ".");
        //return (this != "four"); // will stop running to skip "five"
        var content = this;
        jQuery.each(content, function(key, val) {
            console.log("key = " + key);
            console.log("val = " + JSON.stringify(val));

            var image = val.image;
            if (image) {
                image = '<img src="./images/' + image + '" />';
            } else {
                image = '<img src="./images/default.jpg" />';
            }

            if (cardNumber == LAST_CARD_INDEX) {
                $(".list").append('<li><div id="card' +
                    cardNumber +
                    '" class="card"><div class="back"><h1>' +
                    key + '</h1></div><div class="front">' +
                    image + '</div></div></li>');
            } else {
                $(".list").append('<li><div id="card' +
                    cardNumber +
                    '" class="card"><div class="front"><h1>' +
                    key + '</h1></div><div class="back">' +
                    image + '</div></div></li>');
            }
            cardNumber++;
        });
    });
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function changeChar(char) {

    if (!data.hasOwnProperty(char)) {
        console.log("해당키가 없습니다");
        return;
    }
    var oldKey = Object.keys(shuffledData[LAST_CARD_INDEX]);
    console.log("oldKey = " + oldKey);
    var oldImg = shuffledData[LAST_CARD_INDEX][oldKey].image;
    console.log("oldImg = " + oldImg);

    shuffledData = data[char];
    console.log("shuffledData = " + shuffledData);
    var newKey = Object.keys(shuffledData[LAST_CARD_INDEX]);
    console.log("newKey = " + newKey);
    var newImg = shuffledData[LAST_CARD_INDEX][newKey].image;
    console.log("newImg = " + newImg);

    if (oldImg == newImg) {
        //console.log("이미지가 같습니다");
    } else {
        //console.log("이미지가 다릅니다");
        $("#card" + LAST_CARD_INDEX + " .front")
            .html('<img src="./images/' + newImg + '" />');
    }

    stackCards();

    setTimeout(function() {
        $(".list").empty();
        //카드초기화
        initCards(shuffledData);
    }, 13 * ANIMATION_DURATION_TIME);
}
