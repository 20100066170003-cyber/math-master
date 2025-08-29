let currentLevel = 1;
let puzzleBoard = document.getElementById('puzzle-board');
let numberBank = document.getElementById('number-bank');
let gameMessage = document.getElementById('game-message');
let dragItem = null;

// The puzzle equations and solutions
const puzzles = {
    easy: [
        { equation: [2, '+', null, '=', 5], solution: 3 },
        { equation: [6, '-', 2, '=', null], solution: 4 },
        { equation: [null, '*', 2, '=', 8], solution: 4 },
        { equation: [10, '/', null, '=', 5], solution: 2 },
        { equation: [7, '-', null, '=', 1], solution: 6 },
        { equation: [null, '+', 4, '=', 9], solution: 5 },
        { equation: [3, '*', null, '=', 12], solution: 4 },
        { equation: [8, '/', 4, '=', null], solution: 2 },
        { equation: [null, '-', 3, '=', 5], solution: 8 },
        { equation: [2, '+', 8, '=', null], solution: 10 }
    ],
    hard: [
        { equation: [15, '-', null, '=', 7], solution: 8 },
        { equation: [null, '+', 12, '=', 20], solution: 8 },
        { equation: [4, '*', null, '=', 16], solution: 4 },
        { equation: [20, '/', null, '=', 5], solution: 4 },
        { equation: [null, '-', 5, '=', 9], solution: 14 },
        { equation: [11, '+', null, '=', 18], solution: 7 },
        { equation: [14, '/', 2, '=', null], solution: 7 },
        { equation: [null, '*', 5, '=', 25], solution: 5 },
        { equation: [18, '-', 9, '=', null], solution: 9 },
        { equation: [13, '+', null, '=', 20], solution: 7 }
    ]
};

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => setLevel(1));

function setLevel(level) {
    currentLevel = level;
    resetGame();
}

function resetGame() {
    gameMessage.textContent = '';
    const difficulty = currentLevel <= 10 ? 'easy' : 'hard';
    const puzzleIndex = Math.floor(Math.random() * puzzles[difficulty].length);
    const puzzle = puzzles[difficulty][puzzleIndex];

    renderBoard(puzzle.equation, puzzle.solution);
    renderNumberBank(puzzle.solution);
}

function renderBoard(equation, solution) {
    puzzleBoard.innerHTML = '';
    let blankSlotIndex = equation.indexOf(null);

    equation.forEach((item, index) => {
        let slot = document.createElement('div');
        slot.classList.add('slot');

        if (item !== null) {
            slot.textContent = item;
        } else {
            slot.classList.add('empty-slot');
            slot.dataset.correctValue = solution;
        }

        slot.addEventListener('dragover', e => e.preventDefault());
        slot.addEventListener('drop', handleDrop);
        slot.addEventListener('dragenter', e => e.preventDefault());
        slot.addEventListener('dragleave', e => e.preventDefault());
        
        puzzleBoard.appendChild(slot);
    });
}

function renderNumberBank(solution) {
    numberBank.innerHTML = '';
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Bank for easy levels
    if (currentLevel > 10) {
        numbers.push(11, 12, 13, 14, 15, 16, 17, 18, 19, 20); // Add more for hard
    }
    
    // Add the correct solution to the number bank if not already present
    if (!numbers.includes(solution)) {
        numbers.push(solution);
    }

    shuffleArray(numbers).forEach(number => {
        let draggable = document.createElement('div');
        draggable.classList.add('draggable');
        draggable.textContent = number;
        draggable.draggable = true;
        draggable.dataset.value = number;
        
        draggable.addEventListener('dragstart', handleDragStart);
        draggable.addEventListener('dragend', handleDragEnd);
        
        numberBank.appendChild(draggable);
    });
}

function handleDragStart(e) {
    dragItem = e.target;
    e.dataTransfer.setData('text/plain', e.target.dataset.value);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDrop(e) {
    e.preventDefault();
    if (e.target.classList.contains('empty-slot')) {
        let droppedValue = e.dataTransfer.getData('text/plain');
        
        // Place the dropped number into the empty slot
        e.target.textContent = droppedValue;
        e.target.classList.remove('empty-slot');
        e.target.classList.add('filled');
        dragItem.style.display = 'none';

        checkSolution();
    }
}

function checkSolution() {
    let emptySlots = document.querySelectorAll('.empty-slot');
    if (emptySlots.length === 0) {
        let filledSlot = document.querySelector('.filled');
        let correctValue = parseInt(filledSlot.dataset.correctValue);
        let userValue = parseInt(filledSlot.textContent);

        if (userValue === correctValue) {
            gameMessage.textContent = 'Correct! Well done!';
            gameMessage.style.color = 'green';
        } else {
            gameMessage.textContent = 'Incorrect. Try again!';
            gameMessage.style.color = 'red';
        }
    }
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
