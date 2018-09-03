'use strict';

function startWelcome() {
  $('#intro-page').toggle().delay(200).fadeIn(1000);
  $('#modal').toggle().delay(500).slideDown(3000);
  $('#main-app').toggle(false);
  $('#end-page').toggle(false);
}

function toggleMainApp() {
  $('#intro-page').toggle().delay(200).slideUp(2000).fadeOut(500);
  $('#modal').toggle().delay(500).slideUp(1000);
  $('#main-app').toggle().delay(1000).slideDown(4000).fadeIn(500);
  $('#end-page').toggle(false);
}

function handleWelcomeGoSubmit() {
  $('#welcome-form').submit(function(event) {
    event.preventDefault();
    
    toggleMainApp();

    const introName = $('#hello-name').val();
    $('#nav-player-name').html(introName);
  });
}

function generateQuestion() {
  let thisQuestion = $('#question-slot').html();
  let num = STATS.questionNumber;
  
  thisQuestion = STORE[num -1].question;

  $('#lbl-option-1').html(STORE[num -1].choices[0]);
  $('#option-1').val(STORE[num -1].choices[0]);

  $('#lbl-option-2').html(STORE[num -1].choices[1]);
  $('#option-2').val(STORE[num -1].choices[1]);

  $('#lbl-option-3').html(STORE[num -1].choices[2]);
  $('#option-3').val(STORE[num -1].choices[2]);

  $('#lbl-option-4').html(STORE[num -1].choices[3]);
  $('#option-4').val(STORE[num -1].choices[3]);

  $('#feedback-trivia').html(STORE[num -1].feedback);

  console.log(thisQuestion);
  return thisQuestion;
}

function renderQuestion() {
  let firstQuestion = generateQuestion();
  $('#question-slot').html(firstQuestion);
}

function calculatePercent() {
  let scorePercent = (STATS.correct / STORE.length) * 100;
  console.log("scorePercent: " + scorePercent + " %");

  return scorePercent;
};

function handleOptionSelect() {
  $('#answer-form').on('submit', function (event) {
    event.preventDefault();

    let optionSelected = $('input:checked').val();
    let num = STATS.questionNumber - 1;

    if (optionSelected === STORE[num].answer()) {
      //Feedback if correct
      const statCorrect = STATS.correct;
      STATS.correct = statCorrect + 1;

      const currentScore = calculatePercent();
      $('#question-score').html(currentScore);

      STATS.isCorrect = true;
      console.log("Correct: " + optionSelected + " vs " + STORE[num].answer());
    } else {
      //Feedback if wrong
      const statIncorrect = STATS[0].incorrect;
      STATS[0].incorrect = statIncorrect + 1;

      STATS[0].isCorrect = false;
      console.log("Incorrect: " + optionSelected + " vs " + STORE[num].answer());
    }
  });
}

function renderQuizPage() {
  $('#feedback-section').hide();
  $('#lbl-keep-going').hide();
  $('#btn-submit-next').hide();

  handleOptionSelect();

  const currentQuestionNumber = STATS.questionNumber;
  $('#question-number').html(currentQuestionNumber);

  renderQuestion();
}

function increaseQuestionNumber() {
  let nextQuestionNumber = STATS.questionNumber;

  if (nextQuestionNumber <= STORE.length) {
    nextQuestionNumber = nextQuestionNumber + 1;

    STATS.questionNumber = nextQuestionNumber;
    $('#question-number').html(STATS.questionNumber);
  } else {
    return false;
  }
}

function toggleFeedback() {
  $('#feedback-section').toggle(false);
  $('#lbl-final-answer').toggle(true);
  $('#btn-submit-yes').toggle(true);
}

function handleNextButton() {
  $('#answer-form').on('click','#btn-submit-next', function(event) {
    event.preventDefault();

    $('input[name="radio"]').prop('checked', false);

    toggleFeedback();

    $('#lbl-keep-going').toggle(false);
    $('#btn-submit-next').toggle(false);

    increaseQuestionNumber();

    if (STATS.questionNumber <= STORE.length) {
      renderQuestion();
    } else {
      return false;
    }
  });
}

function handleQuizFormSubmit() {
  $('#answer-form').submit(function(event) {
    event.preventDefault();

    $('#feedback-section').toggle(true);
    
    if (STATS.isCorrect === true) {
      $('#lbl-feedback-correct').toggle(true);
      $('#lbl-feedback-wrong').toggle(false);
    } else {
      $('#lbl-feedback-correct').toggle(false);
      $('#lbl-feedback-wrong').toggle(true);
    }

    $('#lbl-final-answer').toggle(false);
    $('#btn-submit-yes').toggle(false);

    $('#lbl-keep-going').toggle(true);
    $('#btn-submit-next').toggle(true);

    endOfQuiz();
  });
}

function resetStats() {
  STATS.score = 0;
  STATS.questionNumber = 1;
  STATS.correct = 0;
  STATS.isCorrect = false;
  STATS.incorrect = 0;
  STATS.grade = "";
}

function handleEndGoSubmit() {
  $('#end-form').submit(function(event) {
    event.preventDefault();

    resetStats();

    toggleMainApp();

    $('#question-score').html(STATS.score);

    $('#question-number').html(STATS.questionNumber);

    renderQuestion();

    $('input[name="radio"]').prop('checked', false);

    toggleFeedback();
  });
}

function endOfQuiz() {
  let nextNumber = STATS.questionNumber;
  let maxNumber = STORE.length;
  console.log("nextNum: " + nextNumber + " vs maxNumber: " + maxNumber);

  if (nextNumber === maxNumber) {
    let correct = STATS.correct;
    let count = STORE.length;
    let total = (correct / count) * 100;

    let lblCorrect = "Correctly Answered: ";
    let lblIncorrect = "Incorrectly Answered: ";
    let lblCount = "Number of Questions: ";
    let lblScore = "Total Score: ";

    $('#end-result').html(
      `<span>${lblCorrect} ${STATS.correct}</span><br>
      <span>${lblIncorrect} ${STATS.incorrect}</span><br>
      <span>${lblCount} ${STORE.length}</span><br>
      <span>${lblScore} ${total} %</span><br>`
    );

    $('#lbl-keep-going').toggle(false);
    $('#btn-submit-next').toggle(false);

    console.log("End of Quiz");

    setTimeout(function() {
      $('#main-app').toggle(false);
      $('#end-page').toggle(true);
    }, 3000);
  }
}

function startQuizApp() {
  startWelcome();
  handleWelcomeGoSubmit();
  renderQuizPage();
  handleQuizFormSubmit();
  handleNextButton();
  handleEndGoSubmit();
}

$(startQuizApp);