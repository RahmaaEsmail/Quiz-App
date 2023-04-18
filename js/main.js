// Reference
const startBtn = document.querySelector(".start-btn");
const restartBtn = document.querySelector(".restart-btn")
const startScreen = document.querySelector(".start-screen");
const displayScreen = document.querySelector(".display-screen");
const restartScreen = document.querySelector(".restart-screen");
const numOfQuestion = document.querySelector(".number-of-question");
const nextQuestion = document.querySelector(".next-btn");
const resultOfAnswer = document.querySelector(".result-of-answer")
const countTime = document.querySelector(".count-time");
let answersList;
let countCorrectAns = 0;
let time = 10;
let countDuration;

// Handel start and restart quiz 
const startQuiz = function () {
    startScreen.classList.add("hide");
    restartScreen.classList.add("hide");
    displayScreen.classList.remove("hide");
    countCorrectAns = 0;
    questionsApi()
}
startBtn.addEventListener("click", startQuiz)
restartBtn.addEventListener("click", startQuiz)

// Display box of questions
const displayQuestions = function (data, currentQues = 0) {
    let dataBox;
    numOfQuestion.textContent = `${currentQues + 1} of ${data.length}`;
    if (currentQues == data.length) {
        displayScreen.classList.add("hide");
        restartScreen.classList.remove("hide")
    }

    dataBox = `
        <h2>${data[currentQues].title}</h2>
        <ul class="question-list">
        <li class="answer option">${data[currentQues].answer_1}</li>
        <li class="answer option">${data[currentQues].answer_2}</li>
        <li class="answer option">${data[currentQues].answer_3}</li>
        <li class="answer option">${data[currentQues].answer_4}</li>
        </ul>
        `
    document.querySelector(".question-body").innerHTML = dataBox;
    clearInterval(countDuration)
    displayNextQuestions(data, currentQues)
}

//handeled next question 
const nextQuestionbtn = function (data) {
    let currentQues = 0;

    // next question
    nextQuestion.addEventListener("click", function () {
        currentQues++;
        clearInterval(countDuration)
        displayQuestions(data, currentQues)
        chooseAnswer(data, currentQues)
    })
}

const hideOtherAnswer = function (answersList) {
    answersList.forEach(ans => {
        ans.classList.add("pointer")
    })
}

// mark correct Answer
const correctAns = function (ans) {
    ans.classList.add("correct-ans");
}

// Mark Wrong Answer
const wrongAns = function (ans) {
    ans.classList.add("wrong-ans")
}

// Choose Answer
const chooseAnswer = function (data, currentQues = 0) {
    answersList = document.querySelectorAll(".answer");
    answersList.forEach(ans => {
        ans.addEventListener("click", function () {
            const userAns = this.textContent;

            if (userAns === data[currentQues].correct_ans) {
                // change only one background
                hideOtherAnswer(answersList)

                // change background of correct answer
                correctAns(this)
                countCorrectAns++;
                showResult(data, countCorrectAns)

            }
            else {
                hideOtherAnswer(answersList)

                // change background of wrong answer
                wrongAns(this)
            }
        })
    })
}

// Show result after ending all questions
const showResult = function (data, countCorrectAns) {
    resultOfAnswer.textContent = ` ${countCorrectAns > 3 ? "You Win 🎉" : "You Lost ⛔ , try again"} , Your score is ${countCorrectAns} out of ${data.length}`
}

// Timer with display next question
const displayNextQuestions = function (data, currentQues, time = 11) {
    countDuration = setInterval(() => {
        time--;
        countTime.textContent = `00:${time < 10 ? "0" + time : time}`
        if (time == 0) {
            currentQues++;
            clearInterval(countDuration);
            displayQuestions(data, currentQues)
        }
    }, 1000)

}

const questionsApi = async function () {
    const res = await fetch("../question.json");
    const data = await res.json();
    // next Question
    nextQuestionbtn(data)

    // initial Question
    displayQuestions(data)

    //chooseAnswer
    chooseAnswer(data)

    // empty Result
    showResult(data, 0)
}
questionsApi()

