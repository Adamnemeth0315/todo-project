'use strict';

const cards = document.querySelectorAll('.card');
const cardsFront = document.querySelectorAll('.flip-front');
const cardsBack = document.querySelectorAll('.flip-back');
let counter = 0;
const imagesArray = [...cardsBack];
const deckOfCards = ['toldiCrock', 'pancratorCrock', 'armyCrock', 'jungleCrock', 'armorCrock'];
const dubleDeck = deckOfCards.concat(deckOfCards);
console.log(dubleDeck);
let pairs = [];
let flips = [];

const startTheGame = () => {
    insertCards();
    addFlipListener();
};

const shuffleCards = (array) => {
    let n = array.length;
    let copy = [];
    let i = '';
    while (n) {
        i = Math.floor(Math.random() * (n -= 1));
        copy.push(array.splice(i, 1)[0])
    }
    return copy;
}

const insertCards = () => {
    const cardImgs = shuffleCards(dubleDeck);
    cardImgs.forEach((item, index) => cardsBack[index].classList.add(item));
}

const addFlipListener = () => {
    cards.forEach(card => {
        card.addEventListener('click', addFlip);
    })
}

const addFlip = (event) => {
    const flippedCard = event.target.parentElement;
    flippedCard.classList.toggle('card--flip');
    const flippedCardCrock = flippedCard.lastElementChild.classList.value;
    isPair(flippedCardCrock, flippedCard);
}


const backFlip = () => {
    cards.forEach(item => {
        item.classList.toggle('card--flip');
    })
}

const wrongFlip = () => {
    setTimeout(function () {
        flips.forEach(item => item.classList.toggle('card--flip'))
        flips = [];
    }, 1000);
    pairs = [];
}

let timer = 0;
let stopperIsRunning = false;


const removeTimerListener = () => {
    cards.forEach(card => {
        card.removeEventListener('click', startTimer)
    })
};

const startTimer = () => {
    if (stopperIsRunning) {
        return
    }
    const timerContainer = document.querySelector('.timer');
    let minutes = 0;
    let seconds = 0;
    timer = setInterval(() => {
        seconds += 1;
        let sec;
        let min;
        seconds < 10 ? sec = `0${seconds}` : sec = `${seconds}`
        minutes < 10 ? min = `0${minutes}` : min = `${minutes}`
        timerContainer.textContent = `${min}:${sec}`;
        seconds === 60 ? (minutes += 1, seconds = 0) : '';
    }, 1000)
    removeTimerListener()
    return timer
};
for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', startTimer);
}
const isPair = (pair, flippedCard) => {
    pairs.push(pair);
    flips.push(flippedCard);
    if (pairs.length === 2) {
        if (pairs.every((item, index, pairs) => item === pairs[0])) {
            pairs = [];
            flips = [];
            counter += 1;
            clickProtection()
            setTimeout(clickProtection(), 800)
            winConditions();
        } else {
            clickProtection()
            setTimeout((clickProtection), 900)
            wrongFlip();
        }
    }
}

const clickProtection = () => {
    cards.forEach(card => { card.classList.toggle('noneclick') });
}

const winConditions = () => {
    counter === 5 ? clearInterval(timer) : '';
    counter === 5 ? setTimeout(popUp, 1000) : '';
    counter === 5 ? setTimeout(restartGame, 5000) : '';
    counter === 5 ? setTimeout(popDown, 5000) : '';
}

const restartGame = () => {
    const clockFace = document.querySelector('.timer');
    clockFace.textContent = 'Time : 00:00';
    backFlip()
    clearInterval(timer);
}


startTheGame();

const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.modal__close');
const timeStat = document.querySelector('.timerstat');

const popUp = () => {
    modal.classList.add('modal__up')
    modal.classList.remove('modal__hide');
    printTime();
}

const popDown = () => {
    modal.classList.add('modal__hide');
    modal.classList.remove('modal__up');
}

const printTime = () => {
    timeStat.textContent = `Your time was: ${document.querySelector('.timer').textContent}`;
}

(function modalClose() {
    closeWithX();
    eventSideOutModal();
})();

function closeWithX() {
    closeButton.addEventListener('click', () => {
        modal.classList.remove('modal__up');
        modal.classList.add('modal__hide');
    });
}

function eventSideOutModal() {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.add('modal__hide');
            modal.classList.remove('modal__up');
        }
    })
};



