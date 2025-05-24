const gameField = document.querySelector('.game__field');
const movesCounter = document.getElementById('moves');
const timerDisplay = document.getElementById('time');

const setupDiv = document.querySelector('.game__setup');
const gameArea = document.querySelector('.game__area');

const pairsInput = document.getElementById('pairs-input');
const startStopBtn = document.getElementById('start-stop-btn');
const errorMessage = document.getElementById('error-message');

const images = {
	1: 'barash.webp',
	2: 'bibi.webp',
	3: 'karych.webp',
	4: 'kopatych.webp',
	5: 'krosh.webp',
	6: 'losyash.webp',
	7: 'nyusha.webp',
	8: 'pin.webp',
	9: 'sovunya.webp',
	10: 'yozhik.webp',
};

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;

let timer = null;
let seconds = 0;
let minutes = 0;

let gameStarted = false;
let matchedPairs = 0;
let totalPairs = 0;

function validatePairsCount(value) {
	const num = Number(value);
	if (!Number.isInteger(num) || num < 1 || num > 10) {
		return false;
	}
	return true;
}

startStopBtn.addEventListener('click', () => {
	if (!gameStarted) {
		// Старт игры
		const val = pairsInput.value.trim();
		if (!validatePairsCount(val)) {
			errorMessage.textContent = 'Введите число от 1 до 10';
			return;
		}
		errorMessage.textContent = '';

		totalPairs = Number(val);
		resetGame();
		generateCards(totalPairs);

		setupDiv.style.display = 'none';
		gameArea.style.display = 'block';

		startStopBtn.textContent = 'Закончить игру';
		gameStarted = true;

		startTimer();
	} else {
		// Стоп игры
		stopTimer();
		resetGame();

		gameArea.style.display = 'none';
		setupDiv.style.display = 'block';

		startStopBtn.textContent = 'Начать игру';
		gameStarted = false;
	}
});

function startTimer() {
	timer = setInterval(() => {
		seconds++;
		if (seconds === 60) {
			minutes++;
			seconds = 0;
		}
		timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	}, 1000);
}

function stopTimer() {
	clearInterval(timer);
	timer = null;
}

function resetGame() {
	// очистить всё, чтобы начать заново
	gameField.innerHTML = '';
	moves = 0;
	movesCounter.textContent = moves;
	seconds = 0;
	minutes = 0;
	timerDisplay.textContent = '00:00';
	gameStarted = false;
	matchedPairs = 0;
	firstCard = null;
	secondCard = null;
	lockBoard = false;
	stopTimer();
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function createCardElement(id, imgSrc) {
	const card = document.createElement('div');
	card.classList.add('game__card');
	card.dataset.value = imgSrc;
	card.dataset.id = id;

	const front = document.createElement('div');
	front.classList.add('card__front');
	front.textContent = '?';

	const back = document.createElement('div');
	back.classList.add('card__back');

	const img = document.createElement('img');
	img.src = `img/${imgSrc}`;
	back.appendChild(img);

	card.append(front, back);

	card.addEventListener('click', onCardClick);

	return card;
}

function onCardClick(e) {
	if (lockBoard) return;
	const card = e.currentTarget;
	if (card === firstCard) return; // нельзя открыть ту же карту дважды

	// if (!gameStarted) {
	// 	gameStarted = true;
	// 	startTimer();
	// }

	card.classList.add('flip');

	if (!firstCard) {
		firstCard = card;
		return;
	}

	secondCard = card;
	lockBoard = true;
	moves++;
	movesCounter.textContent = moves;

	checkForMatch();
}

function checkForMatch() {
	if (firstCard.dataset.value === secondCard.dataset.value) {
		// совпали
		firstCard.removeEventListener('click', onCardClick);
		secondCard.removeEventListener('click', onCardClick);
		matchedPairs++;

		resetTurn();

		if (matchedPairs === totalPairs) {
			stopTimer();
			setTimeout(() => {
				alert(
					`Поздравляем! Вы нашли все пары за ${moves} ходов и время ${timerDisplay.textContent}`
				);
			}, 200);
			startStopBtn.textContent = 'Начать заново';
		}
	} else {
		// не совпали - перевернуть обратно через 1 секунду
		setTimeout(() => {
			firstCard.classList.remove('flip');
			secondCard.classList.remove('flip');
			resetTurn();
		}, 1000);
	}
}

function resetTurn() {
	[firstCard, secondCard] = [null, null];
	lockBoard = false;
}

function generateCards(pairsCount) {
	// тусуем картинки
	const imageKeys = Object.keys(images);
	const shuffledKeys = shuffle(imageKeys);
	// берем только столько, сколько нужно пар
	const selectedKeys = shuffledKeys.slice(0, pairsCount);

	// создаем пары и тасуем на поле
	let values = [];
	selectedKeys.forEach((key) => {
		values.push(key);
		values.push(key);
	});
	values = shuffle(values);

	// cоздаём карточки в DOM
	for (let i = 0; i < values.length; i++) {
		const card = createCardElement(i, images[values[i]]);
		gameField.appendChild(card);
	}
}
