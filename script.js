// Script.js - Leaderboard Logic (Phase 1)

console.log("GitWars Leaderboard loaded.");

// Table body
const leaderboardBody = document.getElementById("leaderboard-body");

// Controls
const nameInput = document.getElementById("team-name-input");
const initialPointsSelect = document.getElementById("initial-points");
const addTeamBtn = document.getElementById("add-team-btn");

if (addTeamBtn) {
  addTeamBtn.addEventListener("click", () => {
    const name = (nameInput && nameInput.value || "").trim();
    const initial = parseInt((initialPointsSelect && initialPointsSelect.value) || "0", 10) || 0;
    if (!name) {
      alert("Please enter a team name.");
      if (nameInput) nameInput.focus();
      return;
    }
    addTeam(name, initial);
    if (nameInput) {
      nameInput.value = "";
      nameInput.focus();
    }
  });
}

// In-memory team data
let teams = [];

/* =========================
   RENDER LEADERBOARD
========================= */
function renderLeaderboard() {
  leaderboardBody.innerHTML = "";

  // Sort teams by score (descending)
  teams.sort((a, b) => b.score - a.score);

  teams.forEach((team, index) => {
    const row = document.createElement("tr");
    row.classList.add("team-row");

    row.innerHTML = `
      <td class="rank">${index + 1}</td>
      <td class="team-name">${team.name}</td>
      <td class="score">${team.score}</td>
      <td class="shields">${team.shields}</td>
      <td class="actions">
        <button onclick="increaseScore('${team.id}', 10)">+10</button>
        <button onclick="decreaseScore('${team.id}', 10)">-10</button>
        <button onclick="addShield('${team.id}')">+ Shield</button>
        <button onclick="useShield('${team.id}')">Use 🛡️</button>
        <button class="delete-btn" onclick="deleteTeam('${team.id}')">❌</button>
      </td>
    `;

    leaderboardBody.appendChild(row);
  });
}

/* =========================
   TEAM MANAGEMENT
========================= */

// Add new team (accepts optional initial score)
function addTeam(name, initialScore = 0) {
  if (!name) return;

  teams.push({
    id: "team_" + Date.now(),
    name: name,
    score: Number(initialScore) || 0,
    shields: 0
  });

  renderLeaderboard();
}

// Delete team
function deleteTeam(teamId) {
  teams = teams.filter(team => team.id !== teamId);
  renderLeaderboard();
}

/* =========================
   SCORE MANAGEMENT
========================= */

// Increase score
function increaseScore(teamId, points) {
  const team = teams.find(t => t.id === teamId);
  if (!team) return;

  team.score += points;
  renderLeaderboard();
}

// Decrease score
function decreaseScore(teamId, points) {
  const team = teams.find(t => t.id === teamId);
  if (!team) return;

  team.score = Math.max(0, team.score - points);
  renderLeaderboard();
}

/* =========================
   SHIELD LOGIC
========================= */

// Add shield (Round 1 reward)
function addShield(teamId) {
  const team = teams.find(t => t.id === teamId);
  if (!team) return;

  team.shields += 1;
  renderLeaderboard();
}

// Use shield (Round 2 protection)
function useShield(teamId) {
  const team = teams.find(t => t.id === teamId);
  if (!team || team.shields <= 0) return;

  team.shields -= 1;
  alert("Shield used! Damage blocked 🛡️");
  renderLeaderboard();
}

/* =========================
   DEMO DATA (REMOVE LATER)
========================= */
addTeam("Team Skywalker");
addTeam("Team Vader");
addShield(teams[0].id);
increaseScore(teams[0].id, 50);
increaseScore(teams[1].id, 30);

/* =========================
   TIMER LOGIC
========================= */
(function() {
    let timerInterval;
    let currentDuration = 30; // Default
    let timeRemaining = 30;
    let isRunning = false;

    const displayElement = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const presetBtns = document.querySelectorAll('.preset-btn');

    function updateDisplay() {
        if (!displayElement) return;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        // Format MM:SS
        displayElement.textContent = 
            (minutes < 10 ? '0' + minutes : minutes) + ':' + 
            (seconds < 10 ? '0' + seconds : seconds);
        
        if (timeRemaining === 0) {
            displayElement.classList.add('time-up');
            displayElement.textContent = "TIME'S UP";
        } else {
            displayElement.classList.remove('time-up');
        }
    }

    function startTimer() {
        if (isRunning) return;
        if (timeRemaining <= 0) return;
        
        isRunning = true;
        displayElement.classList.remove('time-up');
        
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateDisplay();

            if (timeRemaining <= 0) {
                stopTimer();
            }
        }, 1000);
    }

    function stopTimer() {
        isRunning = false;
        clearInterval(timerInterval);
    }

    function resetTimer() {
        stopTimer();
        timeRemaining = currentDuration;
        updateDisplay();
        if (displayElement) displayElement.classList.remove('time-up');
    }

    // Event Listeners
    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (pauseBtn) pauseBtn.addEventListener('click', stopTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            stopTimer();
            const duration = parseInt(btn.dataset.time);
            currentDuration = duration;
            timeRemaining = duration;
            updateDisplay();
            if (displayElement) displayElement.classList.remove('time-up');
        });
    });

    // Init
    updateDisplay();
})();


