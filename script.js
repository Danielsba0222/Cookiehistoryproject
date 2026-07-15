// script.js
// Grades the cookie quiz for Milestone 2, shows the overall pass or fail
// result, the total score, and the result for each question, then lets
// the user reset everything with the Reset Quiz button.

const answerKey = {
  q1: ["set-cookie", "set cookie"],
  q2: "b",
  q3: "c",
  q4: "c",
  q5: ["a", "b", "d"]
};

const questionText = {
  q1: "A cookie is created when a server response includes a Set-Cookie header.",
  q2: "Lou Montulli invented the HTTP cookie in 1994.",
  q3: "Third party cookies are the type most associated with cross site ad tracking.",
  q4: "The ePrivacy Directive was the first law to require consent for non essential cookies.",
  q5: "Antitrust concerns, advertiser revenue drops, and low industry adoption all caused delays."
};

const form = document.getElementById("quizForm");
const summaryBox = document.getElementById("resultSummary");
const detailsBox = document.getElementById("resultDetails");
const resetBtn = document.getElementById("resetQuizBtn");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let correctCount = 0;
  const total = 5;
  let detailsHTML = "";

  // Question 1, fill in the blank
  const q1Value = document.getElementById("q1").value.trim().toLowerCase();
  const q1Correct = answerKey.q1.some(function (a) {
    return q1Value.includes(a);
  });
  if (q1Correct) correctCount++;
  detailsHTML += buildDetailRow(1, questionText.q1, q1Correct);

  // Questions 2 through 4, single choice
  ["q2", "q3", "q4"].forEach(function (name, index) {
    const selected = form.querySelector('input[name="' + name + '"]:checked');
    const isCorrect = selected && selected.value === answerKey[name];
    if (isCorrect) correctCount++;
    detailsHTML += buildDetailRow(index + 2, questionText[name], isCorrect);
  });

  // Question 5, multi select
  const checked = Array.from(form.querySelectorAll('input[name="q5"]:checked')).map(function (el) {
    return el.value;
  });
  const q5Correct = arraysMatch(checked.slice().sort(), answerKey.q5.slice().sort());
  if (q5Correct) correctCount++;
  detailsHTML += buildDetailRow(5, questionText.q5, q5Correct);

  const percent = Math.round((correctCount / total) * 100);
  const passed = percent >= 70;

  summaryBox.classList.remove("hidden", "resultPass", "resultFail");
  summaryBox.classList.add(passed ? "resultPass" : "resultFail");
  summaryBox.innerHTML =
    "Result: " + (passed ? "PASS" : "FAIL") +
    " &nbsp;|&nbsp; Score: " + correctCount + " / " + total +
    " (" + percent + "%)";

  detailsBox.innerHTML = detailsHTML;
  summaryBox.scrollIntoView({ behavior: "smooth", block: "center" });
});

function buildDetailRow(num, text, isCorrect) {
  const label = isCorrect ? "Correct" : "Incorrect";
  const cssClass = isCorrect ? "answerCorrect" : "answerIncorrect";
  return (
    '<div class="quizQuestion">' +
    "<p><strong>Question " + num + ":</strong> " + text + "</p>" +
    '<p class="' + cssClass + '">' + label + "</p>" +
    "</div>"
  );
}

function arraysMatch(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

resetBtn.addEventListener("click", function () {
  form.reset();
  summaryBox.classList.add("hidden");
  summaryBox.innerHTML = "";
  detailsBox.innerHTML = "";
});
