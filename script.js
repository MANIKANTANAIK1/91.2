// ---------- WALLET SETUP ----------
const walletDisplay = document.getElementById('wallet-balance');

// MODIFIED: Robust wallet initialization from localStorage
let wallet = 500;


if (isNaN(wallet)) {
    wallet = 500;
    localStorage.setItem('wallet', wallet.toFixed(2));
}
walletDisplay.textContent = `₹${wallet.toFixed(2)}`;

function updateWallet(amount) {
  wallet += amount;
  localStorage.setItem('wallet', wallet.toFixed(2));
  walletDisplay.textContent = `₹${wallet.toFixed(2)}`;
}

// ---------- BETTING POPUP ----------
const bettingPopup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const selectionDisplay = document.getElementById("selection-display");
const confirmBtn = document.querySelector(".confirm-btn");

let selectedType = ""; // red, green, big, etc
let selectedBalance = 1;
let selectedQuantity = 1;
let selectedMultiplier = 1;
// MODIFIED: This is the ONLY declaration for pendingBet
let pendingBet = null; // Will store the bet details if placed

document.querySelectorAll('.color-buttons button, .size-buttons button').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedType = btn.textContent.toLowerCase();
    const color = getColorCode(selectedType);
    popupTitle.textContent = `Bet on ${btn.textContent}`;
    popupTitle.style.backgroundColor = color;
    selectionDisplay.value = `Selected: ${btn.textContent}`;
    bettingPopup.style.display = 'flex';


      updateTheme(selectedType); // Call the new function to change the theme
    
    // MODIFIED: Ensure quantity is reset and input field is updated when modal opens
    selectedQuantity = 1;
    document.getElementById("quantityInput").value = selectedQuantity;

    updateTotal();
  });
});

// Cancel button
document.querySelector(".cancel-btn").addEventListener("click", () => {
  bettingPopup.style.display = "none";
});

// ---------- BALANCE OPTIONS ----------
document.querySelectorAll(".balance-options button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedBalance = parseInt(btn.textContent);
    // MODIFIED: Add active class toggle for balance buttons
    document.querySelectorAll(".balance-options button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    updateTotal();
  });
});

// ---------- QUANTITY + / - ----------
document.getElementById("plusBtn").addEventListener("click", () => {
  selectedQuantity++;
  document.getElementById("quantityInput").value = selectedQuantity;
  updateTotal();
});
document.getElementById("minusBtn").addEventListener("click", () => {
  if (selectedQuantity > 1) {
    selectedQuantity--;
    document.getElementById("quantityInput").value = selectedQuantity;
    updateTotal();
  }
});

// ---------- MULTIPLIERS ----------
document.querySelectorAll(".multipliers button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedMultiplier = parseInt(btn.textContent.replace('X', ''));
    document.querySelectorAll(".multipliers button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    updateTotal();
  });
});

// ---------- TOTAL AMOUNT ----------
function updateTotal() {
    // MODIFIED: Get quantity value directly from input for calculations
    const currentQuantity = parseInt(document.getElementById("quantityInput").value) || 1;
    selectedQuantity = currentQuantity; // Keep selectedQuantity in sync

    const total = selectedBalance * selectedQuantity * selectedMultiplier;
    confirmBtn.textContent = `Total amount ₹${total.toFixed(2)}`;
    confirmBtn.dataset.total = total;
}

// ---------- COLOR CODE ----------
function getColorCode(type) {
  switch (type) {
    case 'red': return '#e63946';
    case 'green': return '#38b000';
    case 'violet': return '#9d4edd';
    case 'big': return '#ff6666';
    case 'small': return '#66b3ff';
    default: return '#17a2b8';
  }
}

// ---------- GAME LOGIC ----------
// This should ideally be dynamic or fetched
let currentPeriod = 20250620100010170n; 
const currentPeriodE1 = document.getElementById('current-period');
let gameHistory = [];

function getRandomColor() {
  const colors = ["green", "red", "violet"];
  const includeTwo = Math.random() < 0.3;
  if (includeTwo) {
    const shuffled = [...colors].sort(() => 0.5 - Math.random()); // Use spread to avoid modifying original colors array
    return shuffled.slice(0, 2).join(",");
  }
  return colors[Math.floor(Math.random() * colors.length)];
}

function determineSize(number) {
  return number < 5 ? "small" : "big";
}

function capitalize(str) {
    if (!str) return ''; // Handle null/undefined strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function colorEmoji(color) {
  if (color === 'green') return '🟢';
  if (color === 'red') return '🔴';
  if (color === 'violet') return '🟣';
  return '';
}
function updateTheme(colorName) {
  const popup = document.querySelector('.popup');
  if (!popup) return;

  // Remove all theme classes
  popup.classList.remove('theme-red', 'theme-green', 'theme-violet', 'theme-big', 'theme-small');

  // Add theme class
  if (['red', 'green', 'violet', 'big', 'small'].includes(colorName)) {
    popup.classList.add(`theme-${colorName}`);
  }
}


function updatePrevious(result) {
    const prevResultElement = document.getElementById("prev-result");
    if (prevResultElement) {
        const emoji = result.colour.split(',').map(colorEmoji).join(" ");
        prevResultElement.textContent =
            `#${result.periodNumber} - ${result.number} (${capitalize(result.size)}, ${emoji})`;
    }
}

function updateHistory() {
  const tbody = document.getElementById("game-history");
  tbody.innerHTML = "";
  gameHistory.slice(0, 10).forEach(entry => {
    const colorDots = entry.colour.split(',').map(c => `<span class="dot ${c}"></span>`).join(' ');
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.periodNumber}</td>
      <td><span class="num">${entry.number}</span></td>
      <td>${capitalize(entry.size)}</td>
      <td>${colorDots}</td>
    `;
    tbody.appendChild(tr);
  });
}

function showWinPopup(period, number, color, size, bonus) {
  const popup = document.getElementById("popupWin");
  if (!popup) return;

  const displayColor = color.includes(",") ? "Violet" : capitalize(color);

  popup.querySelector(".lottery-number").textContent = number;
  popup.querySelector(".lottery-color").textContent = displayColor;
  popup.querySelector(".lottery-size").textContent = capitalize(size);
  popup.querySelector(".bonus-amount").textContent = `₹${bonus.toFixed(2)}`;
  popup.querySelector(".period-text").textContent = `Period: ${period}`;

  popup.style.display = "flex";

  setTimeout(() => popup.style.display = "none", 3000);
}

// Close popup manually if user clicks
document.querySelector(".close-popup").addEventListener("click", () => {
  document.getElementById("popupWin").style.display = "none";
});




// Allow manual close
document.querySelector(".close-popup-loss").addEventListener("click", () => {
  document.getElementById("popupLoss").style.display = "none";
});


// MODIFIED: simulateResult now checks pendingBet and always processes a result
function simulateResult() {
  const number = Math.floor(Math.random() * 10);
  const color = getRandomColor();
  const size = determineSize(number);

console.log(`Period ${currentPeriod} ended. No bet placed. Result: ${number}, ${color}, ${size}`);

    let userSelection = null;
    let betAmount = 0;
    let win = false;
    let multiplier = 0;
    console.log(`DEBUG: Simulating result for Period: ${currentPeriod}`); 

    // Check if a bet was actually placed in the previous round
    if (pendingBet) {
        userSelection = pendingBet.selection;
        betAmount = pendingBet.amount;
        const selected = userSelection.toLowerCase();
        const colorArray = color.split(",");

        // Determine if the bet won
        if (["red", "green", "violet"].includes(selected)) {
            win = colorArray.includes(selected);
        } else if (["big", "small"].includes(selected)) {
            win = selected === size;
        }
        else if (!isNaN(parseInt(selected))) {
            win = parseInt(selected) === number;
            if (win) multiplier = 9; // Specific multiplier for number bets
        }
    }

    // Set multiplier for win/loss (default 2 for color/size, 0 for loss)
    multiplier = win ? 2 : 0;
    const resultAmount = betAmount * multiplier;

    // Update wallet only if a bet was placed and won
    if (pendingBet && win) { // Only update wallet for actual wins
        updateWallet(resultAmount);
    }


    const result = { periodNumber: currentPeriod.toString(), number, colour: color, size };
    gameHistory.unshift(result);
    updateHistory();
    updatePrevious(result);

    // Show popup only if a bet was placed
    if (pendingBet) {
        if (win) {
            showWinPopup(currentPeriod, number, color, size, resultAmount);
        } else {
            showLossPopup(number, color, size);
        }
    } else {
        // Optional: console log if no bet was placed and no popup shown
        console.log(`Period ${currentPeriod} ended. No bet placed. Result: ${number}, ${color}, ${size}`);
    }


  currentPeriod++;
if (currentPeriodE1) { // Check if the element exists
        currentPeriodE1.textContent = currentPeriod.toString(); }

        console.log(`DEBUG: currentPeriod incremented to: ${currentPeriod}`);
    pendingBet = null; // Clear the pending bet after processing the result
}

// ---------- CONFIRM BET ----------
confirmBtn.addEventListener("click", () => {
  const quantity = parseInt(document.getElementById('quantityInput').value);
  const betAmount = selectedBalance * selectedMultiplier * quantity;

    // MODIFIED: Add insufficient balance check
    if (betAmount > wallet) {
        console.log("Insufficient wallet balance!");
        // You can add a visual alert/toast here
        return; // Prevent betting if balance is low
    }

  updateWallet(-betAmount); // Deduct bet amount from wallet
  bettingPopup.style.display = "none";

  // Save the pending bet
  pendingBet = {
    selection: selectedType,
    amount: betAmount
  };
    console.log("Bet placed:", pendingBet); // For debugging
});

// ---------- TIMER ----------
let timer = 60; // Default to 1 minute, can be updated by game mode tabs
let countdownInterval = null;
// MODIFIED: Removed duplicate `let pendingBet = null;` from here

function startCountdown() {
  clearInterval(countdownInterval); // Ensure any previous interval is cleared

  countdownInterval = setInterval(() => {
    updateTimerDisplay(timer);

    if (timer === 0) {
      clearInterval(countdownInterval); // Stop the current interval
        // MODIFIED: Always call simulateResult at 0 seconds
      simulateResult(); // Process the game result for the finished round
        // MODIFIED: Determine the next round's timer based on active tab
        const activeTab = document.querySelector('.tab.active'); // Assumes your game mode tabs have class 'tab' and 'active'
        let nextTimerDuration = 60; // Default to 1 minute
        if (activeTab) {
            const selectedMode = activeTab.getAttribute('data-mode');
            if (selectedMode === '30s') nextTimerDuration = 60;
            else if (selectedMode === '1min') nextTimerDuration = 60;
            else if (selectedMode === '3min') nextTimerDuration = 60;
            else if (selectedMode === '5min') nextTimerDuration = 60;
        }
        timer = nextTimerDuration; // Set timer for the next round

      startCountdown(); // Restart the countdown for the new period
    } else {
      timer--;
    }
  }, 1000);
}

function updateTimerDisplay(seconds) {
  const timerSpan = document.getElementById("timer");
    if (timerSpan) { // Check if element exists before updating
      timerSpan.textContent = `00:${seconds < 10 ? '0' + seconds : seconds}`;
    }
}

// ---------- INITIAL LOAD ----------
function loadGameData() {
  updateTimerDisplay(timer);
  updateWallet(0); 
    if (currentPeriodE1) {
        currentPeriodE1.textContent = currentPeriod.toString();
    }

// This just refreshes display, doesn't add/subtract
    // Optional: Call updateHistory() here to populate table on load if you have initial data
}

// 💡 Handle number ball click
document.querySelectorAll("#numberBalls img").forEach(img => {
  img.addEventListener("click", () => {
    const number = img.dataset.number;
    selectedType = number; // Save selected number as string

    const color = "#f39c12"; // Orange for number bets
    popupTitle.textContent = `Bet on Number ${number}`;
    popupTitle.style.backgroundColor = color;
    selectionDisplay.value = `Selected: ${number}`;
    
    bettingPopup.style.display = "flex";
    updateTotal();
  });
});


document.addEventListener("DOMContentLoaded", () => {
    updateTheme('red');
  loadGameData();
  startCountdown();

    // MODIFIED: Set default active class for a balance button if none is active initially
    const defaultBalanceButton = document.querySelector(".balance-options button");
    if (defaultBalanceButton && !document.querySelector(".balance-options button.active")) {
        defaultBalanceButton.classList.add("active");
    }
    // MODIFIED: Set default active class for a multiplier button if none is active initially
    const defaultMultiplierButton = document.querySelector(".multipliers button");
    if (defaultMultiplierButton && !document.querySelector(".multipliers button.active")) {
        defaultMultiplierButton.classList.add("active");
    }
    // Call updateTotal to reflect initial values correctly
    updateTotal();
});

function showLossPopup(number, color, size, period) {
  const lossPopup = document.getElementById("popupLoss");
  if (!lossPopup) return;

  const displayColor = color.includes(",") ? "Violet" : capitalize(color);

  lossPopup.querySelector(".lost-number").textContent = number;
  lossPopup.querySelector(".lost-color").textContent = displayColor;
  lossPopup.querySelector(".lost-size").textContent = capitalize(size);
  lossPopup.querySelector(".period-text").textContent = `Period: ${period}`;
  lossPopup.querySelector(".bonus-amount").textContent = `₹0.00`;

  lossPopup.style.display = "flex";

  setTimeout(() => lossPopup.style.display = "none", 3000);
}
