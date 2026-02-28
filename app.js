'use strict';
// Get DOM Elements
const countSpan = document.querySelector(".quiz-info .count span");
const bulletsContainer = document.querySelector(".bullets .spans");
const bullets = document.querySelector(".bullets");
const quizArea = document.querySelector(".quiz-area");
const answersArea = document.querySelector(".answers-area");
const submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
// Fetching data from the JSON file
async function getData() {
    try {
        const response = await fetch("html_questions.json");
        // Check if the response is successful
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        // Parse the JSON data
        const data = await response.json();
        // Use the data to create the quiz
        const questions = data.length;
        // Create Bullets + Set Questions Count
        createBullets(questions);
        // Add Questions And Answers One By One 
        addQuestion(data[currentIndex], questions);
        // Start Count Down
        startTimer(5, questions);
        // Handle Submit Button Click
        submitButton.addEventListener("click", () => {
            // Get The Right Answer
            let rightAnswer = data[currentIndex].answer;
            currentIndex++;
            // Check The Answer
            checkAnswer(rightAnswer, questions);
            // Remove Previous Question
            quizArea.innerHTML = "";
            answersArea.innerHTML = "";
            // Show Results Of The Quiz
            showResults(questions);
            // Check If Quiz Is Finished
            if (currentIndex === questions) {
                submitButton.innerHTML = "Quiz Finished";
                submitButton.disabled = true;
                return;
            }
            // Clear Count Down Interval And Start New One On Each and Every Question
            clearInterval(countDownInterval);
            startTimer(5, questions);
            // Click Event For Submit Button
            addQuestion(data[currentIndex], questions);
            // Handle Bullets Class
            handleBullets();
        });
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
// Call The Function
getData();
// Create Number Of Questions
function createBullets(num) {
    countSpan.textContent = num;
    // Clear existing bullets
    bulletsContainer.innerHTML = ""; // Clear existing bullets
    for (let i = 0; i < num; i++) {
        const bullet = document.createElement("span");
        bulletsContainer.appendChild(bullet);
        // Set the first bullet as active
        if (i === 0) {
            bullet.classList.add("on");
        }
    }
}
// Add Questions And Answers Function
function addQuestion(data) {
    // Create Question
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(data.title);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);
    // Create Answers
    for (let i = 1; i <= 4; i++) {
        let answerDiv = document.createElement("div");
        answerDiv.classList.add("answer");
        let radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.name = "answer";
        radioInput.id = `answer${i}`;
        let label = document.createElement("label");
        label.setAttribute("for", `answer${i}`);
        let labelText = document.createTextNode(data.options[i - 1]);
        label.appendChild(labelText);
        answerDiv.appendChild(radioInput);
        answerDiv.appendChild(label);
        answersArea.appendChild(answerDiv);
    }
}
// Check Answer Function
function checkAnswer(rAnswer) {
    let answers = document.querySelectorAll('input[name="answer"]');
    let chosenAnswer;
    // Loop Through Answers To Find The Chosen One
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            // Get The Chosen Answer
            chosenAnswer = answers[i].nextElementSibling.textContent;
        }
    }
    // Check If Answer Is Chosen
    if (!chosenAnswer) return;
    // Check If The Chosen Answer Is Right
    if (chosenAnswer === rAnswer) {
        rightAnswers++;
    }
}
// Handle Bullets Class
function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    // Add Class 'on' On Current Bullet
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.classList.add("on");
        }
    });
}
// Show Results Function
function showResults(count) {
    // If This Is The Last Question
    let theResults;
    if (currentIndex === count) {
        // Remove Quiz Area, Answers, Submit Button, And Count Down
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        clearInterval(countDownInterval);
        countDownElement.remove();
        // Show Results
        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, You Answered ${rightAnswers} Out Of ${count}`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect!</span> You Answered ${rightAnswers} Out Of ${count}`;
        } else {
            theResults = `<span class="bad">Bad</span>, You Answered ${rightAnswers} Out Of ${count}`;
        }
        // Set The Results Of The Quiz
        resultsContainer.innerHTML = theResults;
        let restbtn = document.createElement("button");
        restbtn.textContent = "Restart Quiz";
        restbtn.classList.add("restart-button");
        resultsContainer.appendChild(restbtn);
        restbtn.addEventListener("click", () => {
            location.reload();
        });
    }
}
// Start Count Down Function
function startTimer(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(() => {
            // Convert To Minutes And Seconds
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            // Add Zeros If Needed
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            countDownElement.textContent = `${minutes} : ${seconds}`;
            // Decrease Duration
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();
            }
        }, 1000)
    }
};