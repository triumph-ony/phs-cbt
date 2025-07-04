/* -------- DATA -------- */
const questions = [
  {
    question: "Which vitamin is produced in skin by sunlight?",
    options: ["Vitamin A", "Vitamin B₁₂", "Vitamin C", "Vitamin D"],
    answer: 3,
    explanation: "Vitamin D is synthesized in the skin when exposed to sunlight."
  },
  {
    image: "images/example.jpg",
    question: "What organ is shown in the image?",
    options: ["Heart", "Liver", "Lung", "Brain"],
    answer: 0,
    explanation: "The image shows the human heart."
  },
  {
    image: "images/example2.jpg",
    question: "Identify the highlighted organ.",
    options: ["Kidney", "Stomach", "Pancreas", "Spleen"],
    answer: 1,
    explanation: "The highlighted organ is the stomach."
  }
];

/* -------- ELEMENTS -------- */
const startScreen  = document.getElementById("start-screen");
const startBtn     = document.getElementById("start-btn");
const quizContainer= document.getElementById("quiz-container");
const progressBar  = document.getElementById("progress-bar");
const timerEl      = document.getElementById("timer");
const scoreEl      = document.getElementById("score");
const questionEl   = document.getElementById("question");
const optionsEl    = document.getElementById("options");
const imageEl      = document.querySelector(".question-image");
const explanationEl= document.getElementById("explanation");
const nextBtn      = document.getElementById("next-btn");
const resultEl     = document.getElementById("result");
const restartBtn   = document.getElementById("restart-btn");
const sndCorrect   = document.getElementById("sound-correct");
const sndWrong     = document.getElementById("sound-wrong");

/* -------- STATE -------- */
let current = 0, correct = 0, timeLeft = 30, interval;

/* -------- TIMER -------- */
function startTimer(){
  timeLeft = 30;
  timerEl.textContent = timeLeft + " sec";
  clearInterval(interval);
  interval = setInterval(()=>{
    timeLeft--;
    timerEl.textContent = timeLeft + " sec";
    if(timeLeft < 0){ clearInterval(interval); lockChoices(); goNext(); }
  },1000);
}

/* -------- PROGRESS -------- */
function updateProgress(){
  const pct = ((current)/questions.length)*100;
  progressBar.style.width = pct + "%";
}

/* -------- QUIZ FLOW -------- */
function loadQuestion(){
  updateProgress();
  const q = questions[current];
  questionEl.textContent = q.question;
  if(q.image){ imageEl.src = q.image; imageEl.style.display="block"; }
  else{ imageEl.style.display="none"; }

  optionsEl.innerHTML="";
  q.options.forEach((opt,i)=>{
    const li=document.createElement("li");
    li.textContent = opt;
    li.addEventListener("click",()=>selectAnswer(i));
    optionsEl.appendChild(li);
  });

  explanationEl.style.display="none";
  nextBtn.disabled = true;
  updateScore();
  startTimer();
}

function selectAnswer(i){
  const correctIdx = questions[current].answer;
  optionsEl.querySelectorAll("li").forEach((li,idx)=>{
    li.style.pointerEvents="none";
    if(idx===correctIdx) li.style.background="#a5d6a7";
    if(idx===i && idx!==correctIdx) li.style.background="#ef9a9a";
  });

  if(i===correctIdx){
    correct++; sndCorrect.play();
    explanationEl.style.display="none";
  }else{
    sndWrong.play();
    explanationEl.textContent="Explanation: "+questions[current].explanation;
    explanationEl.style.display="block";
  }

  nextBtn.disabled=false;
  clearInterval(interval);
}

function lockChoices(){
  optionsEl.querySelectorAll("li").forEach(li=>li.style.pointerEvents="none");
  clearInterval(interval);
}

function updateScore(){
  scoreEl.textContent = "Score: "+correct+"/"+questions.length;
}

function grade(p){
  if(p>=70) return "A";
  if(p>=60) return "B";
  if(p>=50) return "C";
  if(p>=45) return "D";
  if(p>=40) return "E";
  return "F";
}

function showResult(){
  updateProgress(); // 100%
  const percent = Math.round((correct/questions.length)*100);
  resultEl.innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your Score: <strong>${correct}/${questions.length}</strong> (${percent}%)</p>
    <p>Grade: <strong>${grade(percent)}</strong></p>
  `;
  resultEl.style.display="block";
  restartBtn.style.display="block";
  nextBtn.style.display="none";
}

function goNext(){
  current++;
  if(current<questions.length){ loadQuestion(); }
  else{ clearInterval(interval); showResult(); }
}

/* -------- EVENT LISTENERS -------- */
startBtn.onclick = ()=>{
  startScreen.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  current = correct = 0;
  progressBar.style.width="0";
  loadQuestion();
};

nextBtn.onclick = goNext;

restartBtn.onclick = ()=>{
  current = correct = 0;
  progressBar.style.width="0";
  resultEl.style.display="none";
  restartBtn.style.display="none";
  nextBtn.style.display="block";
  loadQuestion();
};
