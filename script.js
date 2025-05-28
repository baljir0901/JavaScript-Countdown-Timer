let workDuration = 25 * 60;
let shortBreak = 5 * 60;
let longBreak = 15 * 60;
let pomodoroCount = Number(localStorage.getItem("pomodoroCount")) || 0;
let currentTime = workDuration;
let isRunning = false;
let timer;
let mode = "Work";

const timerElement = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");

// ⏰ Sound setup
const alarmSound = new Audio("https://www.soundjay.com/button/beep-07.wav");

// 🍅 Mode display
const modeElement = document.createElement("div");
modeElement.id = "mode";
modeElement.style.marginTop = "10px";

// 🍅 Progress display
const progressElement = document.createElement("div");
progressElement.id = "progress";
progressElement.style.marginTop = "10px";

document.querySelector(".container").appendChild(modeElement);
document.querySelector(".container").appendChild(progressElement);

function updateTimer() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function updateProgress() {
  const emojis = "🍅".repeat(pomodoroCount % 4);
  progressElement.textContent = `Progress: ${emojis}`;
}

function switchMode(newMode) {
  mode = newMode;
  modeElement.textContent = `Mode: ${mode}`;
  if (newMode === "Work") {
    currentTime = workDuration;
  } else if (newMode === "Short Break") {
    currentTime = shortBreak;
  } else if (newMode === "Long Break") {
    currentTime = longBreak;
  }
  updateTimer();
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    startBtn.textContent = "⏹ Stop";
    timer = setInterval(() => {
      if (currentTime > 0) {
        currentTime--;
        updateTimer();
      } else {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = "▶ Start";

        alarmSound.play(); // 🔔 Sound alert

        if (mode === "Work") {
          pomodoroCount++;
          localStorage.setItem("pomodoroCount", pomodoroCount);
          updateProgress();

          if (pomodoroCount % 4 === 0) {
            switchMode("Long Break");
          } else {
            switchMode("Short Break");
          }
        } else {
          switchMode("Work");
        }

        startTimer(); // Auto continue
      }
    }, 1000);
  } else {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = "▶ Start";
  }
}

startBtn.addEventListener("click", startTimer);
switchMode("Work");
updateProgress();
