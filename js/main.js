/* Game code goes here. */
$(document).on('ready', function(){
// Initial jQuery object creations
var gameContainer = $('.game-container');
var infoDisplay = $('.info-display');
var scoreDisplay = $('.score-display');
var guessesDisplay = $('.guesses-display');
var matchesDisplay = $('.matches-display');

/***************** Core Game Functions ****************************************/
var startGame = function(){
    console.log('starting new game');
    // Initialize Game State
    gameState.score = 0;
    gameState.cardsLeft = 24;
    gameState.cardsMatched = [];
    gameState.matchesMade = 0;
    gameState.guessesMade = 0;

    updateInfoDisplay();

    // Load Cards
    deck1 = shuffle(deck.slice()); // Slice makes a copy of deck and sends it to the shuffle so we can keep the deck var intact.
    deck2 = shuffle(deck.slice()); // Do this twice so we have two copies of each card.
    gameState.cards = [].concat(deck1, deck2);
    console.log('gameState initialized');

    gameContainer.empty();
    infoDisplay.removeClass('hidden');

    var cardList = $('<ul>').attr({
        id: 'card-list'
    }).appendTo(gameContainer);
    buildGameBoard();
};
var buildGameBoard = function(){
    console.log('building game board');
    var cardList = $('#card-list');
    $.each(gameState.cards, function(key, card){
        var cardImagePath = 'img/deck/' + card.file;
        var newCardItem = $('<li>').attr({
            class: 'card',
            style: 'background: url("' + cardImagePath + '") top left no-repeat;background-size:contain;',
            'data-slug': card.slug,
            'data-name': card.name,
            'data-file': card.file
        });
        // Append a block to give the "card back" effect over the card.
        $('<span>').attr({
            class: 'back'
        }).appendTo(newCardItem);
        newCardItem.appendTo(cardList);

        addCardListener(newCardItem);
    });
};

var evaluateGuess = function(target){
    // Construct a card object from the current guess
    console.log('evaluating guess');
    var cardTarget = $(target.parentElement);
    var guessCard = {
        slug: cardTarget.data('slug'),
        name: cardTarget.data('name'),
        file: cardTarget.data('file')
    };
    gameState.currentGuess.push(guessCard);

    if (gameState.currentGuess.length == 2){
        console.log('evaluating second selection of a pair');
        // If the currentGuess Array has 2 entries in it, evaluate
        gameState.guessesMade += 1; // Increment the guess counter.

        if(gameState.currentGuess[0].slug == gameState.currentGuess[1].slug) {
            // If the two cards guessed match, then award points and remove the cards
            console.log("you matched!!");
            gameState.matchesMade += 1;
            gameState.cardsMatched.push(gameState.currentGuess[0]);
            recalculateScore();
            updateInfoDisplay();
            deactivateMatchedCards(gameState.currentGuess[0]);
            gameState.currentGuess = [];
        } else {
            console.log('no match = boo!');
            recalculateScore();
            updateInfoDisplay();
            setTimeout(resetGuess, 1000);
        }
    } else if (gameState.currentGuess.length < 2) {
        // If the currentGuess Array has fewer than 2 entries in it, let it keep going
        console.log('first selection of a pair');

    } else if (gameState.currentGuess.length > 2) {
        // If the currentGuess has somehow gotten more than 2 things added, reset everything
        console.log('bad craziness! Somehow more than 2 things are in the list. RESET!');
        setTimeout(resetGuess, 1000);
    }
};

var addCardListener = function(newCardItem){
    // Add an event listener so the cards can be flipped
    newCardItem.on('click', function(event){
        $(event.target.parentElement).find('.back').fadeOut();
        evaluateGuess(event.target);
    });
};

var deactivateMatchedCards = function(card){
    // Remove card instances from active play after a match is made
    var matchedCards = $('li[data-slug="' + card.slug + '"].card');
    matchedCards.off('click');
    matchedCards.removeClass('card').addClass('matchedCard');
    gameState.cardsLeft = gameState.cardsLeft - (gameState.cardsMatched.length * 2);
    if (gameState.cardsLeft <= 0){
        endGame();
    }
};

var recalculateScore = function(){
    gameState.score = (gameState.matchesMade * 5) - (gameState.guessesMade * 2);
};

var updateInfoDisplay = function(){
    matchesDisplay.fadeOut().text(gameState.matchesMade).fadeIn();
    guessesDisplay.fadeOut().text(gameState.guessesMade).fadeIn();
    scoreDisplay.fadeOut().text(gameState.score).fadeIn();
};

var resetGuess = function(){
    $('li[data-slug="'+ gameState.currentGuess[0].slug +'"] .back').fadeIn();
    $('li[data-slug="'+ gameState.currentGuess[1].slug +'"] .back').fadeIn();
    gameState.currentGuess = [];
};

var endGame = function(){
    var rating = "unknown";
    if (gameState.score > 20) {
        rating = "3-stars";
    } else if ((gameState.score <= 20) && (gameState.score > 5)) {
        rating = "2-stars";
    } else if ((gameState.score <=5) && (gameState.score > 0)) {
        rating = "1-star";
    } else {
        rating = "0-star";
    }
    $('#end-game-modal').modal();
    $('.final-score').text(gameState.score);
    $('.final-guesses').text(gameState.guessesMade);
    $('.final-matches').text(gameState.matchesMade);
    $('.final-rating').text(rating);
    $('.play-again').on('click', function(event){
        startGame();
        $('#end-game-modal').modal('hide');
    });
};

/***************** Event Listeners for Start Buttons **************************/
$('.btn-start').on('click', function(event){
    event.preventDefault();
    startGame();
});

}); // end of document ready //////////////////////////////



/***************** Initialized Data Objects and Arrays ************************/

// Define an object that will be used to store the game state during play.
var gameState = {
    score: 0, // Score is calculated with `calculateScore`
    cardsLeft: 12,
    cardsMatched: [], // Array of all the cards matched
    matchesMade: 0, // Used to calculate score: +5x
    guessesMade: 0, // Used to calculate score: -2x
    currentGuess: [], // Array used to store guesses in progress
    cards: [] // Array of cards in the game; populated by `startGame`
}
var deck = [ // An Array of card objects that can be used in the game.
    {
        slug: '1',
        name: '1',
        file: '1.jpg'
    },
    {
        slug: '2',
        name: '2',
        file: '2.jpg'
    },
    {
        slug: '3',
        name: '3',
        file: '3.jpg'
    },
    {
        slug: '4',
        name: '4',
        file: '4.jpg'
    },
    {
        slug: '5',
        name: '5',
        file: '5.jpg'
    },
    {
        slug: '6',
        name: '6',
        file: '6.jpg'
    },
    {
        slug: '7',
        name: '7',
        file: '7.jpg'
    },
    {
        slug: '8',
        name: '8',
        file: '8.jpg'
    },
    {
        slug: '9',
        name: '9',
        file: '9.jpg'
    },
    {
        slug: '10',
        name: '10',
        file: '10.jpg'
    },
    {
        slug: '11',
        name: '11',
        file: '11.jpg'
    },
    {
        slug: '12',
        name: '12',
        file: '12.jpg'
    }
];
var cardBack = { // The default card backing.
    slug: 'default',
    name: 'Default Card Back',
    file: 'skulls.png'
};

/***************** Helper Functions That Don't Need jQuery *******************/
function shuffle(array) {
  var copy = [], n = array.length, i;

  // While there remain elements to shuffle…
  while (n) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * n--);

    // And move it to the new array.
    copy.push(array.splice(i, 1)[0]);
  }

  return copy;
}
