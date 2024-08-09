import CapybaraApi from "./capybaraApi.js";
import DuckApi from "./duckApi.js";

// Create new objects
const capyAPI = new CapybaraApi();
const duckApi = new DuckApi();
const imgSelector = document.querySelector(".photo-section__img");
const dateFormating = {  weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'}
const currentDate = new Date();
const dateSelector = document.querySelector(".nav__currentDate");
dateSelector.innerText = currentDate.toLocaleDateString("en-US", dateFormating);
const scoreSection = document.querySelector(".score-section");
const factContainer = document.createElement("div");

let currentImageType = '';
let userScore = 0;
let currentUsername = '';

const topUserScores = [
    { userName: "Cathy", score: 1000 },
    { userName: "Li", score: 1000 },
    { userName: "Sophia", score: 1000 }
];

async function getDuckImgAndAddToDOM() {
    const duckImageUrl = await duckApi.getDuckImage();
    imgSelector.src = duckImageUrl;
}

async function getCapybaraImgAndAddToDOM() {
    const capybaraImgUrl = await capyAPI.getCapybaraImg();
    imgSelector.src = capybaraImgUrl;
}

async function getRandomCapybaraFact() {
    const response  = await capyAPI.getCapybaraFact();
    const imgContainerSelector = document.querySelector(".photo-section");
    factContainer.classList.add("fact");
    imgContainerSelector.append(factContainer);
    factContainer.innerText = `You got the answer correct here is your random fact about capybaras: ${response}`;
}


async function renderRandomDuckOrCapyImg() {
    const randomNumber = Math.floor(Math.random() * 2);
    if (randomNumber === 0) {
        await getCapybaraImgAndAddToDOM();
        return 'capybara';
    } else {
        await getDuckImgAndAddToDOM();
        return 'duck';
    }
}

// Initialize the game
async function initializeGame() {
    userScore = 0;
    currentImageType = await renderRandomDuckOrCapyImg();
}
// initializeGame()

// Handle the score
async function handleAnswer(userSelected) {
    if (userSelected === currentImageType) {
        const scoreNumber = document.querySelector(".score-section__users-current-score");
        userScore += 100;
        scoreNumber.innerText = userScore;
        //alert(`Correct! Your score is now ${userScore}`);
        updateTopScores();
        getRandomCapybaraFact();
    } else {
        alert(`Wrong! The correct answer was ${currentImageType}. Your score remains ${userScore}`);
    }
    // Render for the next round
    currentImageType = await renderRandomDuckOrCapyImg();
}

function renderUserToList(event) {
    scoreSection.innerText = "";

    event.forEach(user => {
        const usersContainer = document.createElement("div");
        usersContainer.classList.add("score-section__users-container");

        const userName = document.createElement("p");
        userName.classList.add("score-section__user");
        userName.innerText = user.userName;

        const userScore = document.createElement("p");
        userScore.innerText = user.score;

        scoreSection.appendChild(usersContainer);
        usersContainer.appendChild(userName);
        usersContainer.appendChild(userScore);
    })
}

function updateTopScores() {
    const currentUser = {
        userName: currentUsername,
        score: userScore
    };

    const existingUserIndex = topUserScores.findIndex(user => user.userName === currentUsername);

    if (existingUserIndex !== -1) {
        if (userScore > topUserScores[existingUserIndex].score) {
            topUserScores[existingUserIndex].score = userScore;
        }
    } else {
        topUserScores.push(currentUser);
    }

    topUserScores.sort((a, b) => b.score - a.score);
    topUserScores.splice(3);
    console.log("Updated top scores:", topUserScores);
}

const buttonClickCapy = document.querySelector('.photo-section__SelectBtn-2');
const buttonClickDuck = document.querySelector('.photo-section__SelectBtn-1');

// Add event listeners to the buttons
buttonClickCapy.addEventListener('click', () => handleAnswer('capybara'));
buttonClickDuck.addEventListener('click', () => handleAnswer('duck'));

const usernameForm = document.getElementById('username-section__form');
usernameForm.addEventListener('submit', handleUsernameSubmit);

// Handle username submission
function handleUsernameSubmit(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('userName');
    const inputNameSection = document.querySelector(".username-section");
    const userNameContainer = document.createElement("h3");

    const newUsername = usernameInput.value;

    inputNameSection.appendChild(userNameContainer);
    factContainer.innerText = "";

    if (newUsername) {
        currentUsername = newUsername;
        //alert(`Username set to: ${currentUsername}`);
        userNameContainer.innerText = `Hi ${currentUsername} thanks for choosing to play the Quack n' Capy game. Guess if the photos below is a duck or capybara to get a high score!`;
        usernameForm.reset();
        // this is not working. did not add to the list
        renderUserToList(topUserScores);

    } else {
        alert('Please enter a valid username.');
    }
}

// Initialize the game when the page loads
window.addEventListener('load', initializeGame);
renderUserToList(topUserScores);
