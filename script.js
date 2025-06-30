const ninja = document.getElementById("ninja");
const stealthText = document.getElementById("stealth");
const scoreText = document.getElementById("score");

let ninjaX = 280;
let stealth = 100;
let score = 0;
let caught = false;

// Sound FX
const footstep = new Howl({
  src: ["https://cdn.jsdelivr.net/gh/AKARuberDuck/ninja-escape/assets/sfx/footstep.mp3"],
  volume: 0.5,
});
const alert = new Howl({
  src: ["https://cdn.jsdelivr.net/gh/AKARuberDuck/ninja-escape/assets/sfx/alert.mp3"],
  volume: 0.7,
});

// Player movement
document.addEventListener("keydown", (e) => {
  if (caught) return;

  if (e.key === "ArrowLeft" && ninjaX > 0) {
    ninjaX -= 20;
    ninja.style.left = ninjaX + "px";
    footstep.play();
  } else if (e.key === "ArrowRight" && ninjaX < 560) {
    ninjaX += 20;
    ninja.style.left = ninjaX + "px";
    footstep.play();
  }
});

// Light detection loop
setInterval(() => {
  if (caught) return;

  const ninjaBox = ninja.getBoundingClientRect();
  const lights = document.querySelectorAll(".light");
  const covers = document.querySelectorAll(".cover");

  let inLight = false;
  let inCover = false;

  lights.forEach(light => {
    const box = light.getBoundingClientRect();
    if (!(ninjaBox.right < box.left || ninjaBox.left > box.right)) {
      inLight = true;
    }
  });

  covers.forEach(cover => {
    const box = cover.getBoundingClientRect();
    if (!(ninjaBox.right < box.left || ninjaBox.left > box.right)) {
      inCover = true;
    }
  });

  if (inLight && !inCover) {
    stealth -= 10;
    alert.play();
  } else if (!inLight) {
    score += 5;
  } else {
    score += 1;
  }

  stealth = Math.max(0, stealth);
  updateDisplay();

  if (stealth === 0) {
    caught = true;
    stealthText.innerHTML = "⚠️ <strong>CAUGHT!</strong>";
    alert.play();
  }
}, 1000);

function updateDisplay() {
  const blocks = Math.floor(stealth / 10);
  stealthText.textContent = "Stealth: " + "█".repeat(blocks);
  scoreText.textContent = "Score: " + score;
}
