const ninja = document.getElementById("ninja");
const stealthDisplay = document.getElementById("stealth");
const scoreDisplay = document.getElementById("score");

let ninjaX = 280;
let stealth = 100;
let score = 0;
let caught = false;
let level2Triggered = false;

// Sounds
const footstep = new Howl({
  src: ["https://cdn.jsdelivr.net/gh/AKARuberDuck/ninja-escape/assets/sfx/footstep.mp3"],
  volume: 0.5,
});
const alert = new Howl({
  src: ["https://cdn.jsdelivr.net/gh/AKARuberDuck/ninja-escape/assets/sfx/alert.mp3"],
  volume: 0.7,
});

// Movement
document.addEventListener("keydown", (e) => {
  if (caught) return;
  if (e.key === "ArrowLeft" && ninjaX > 0) {
    ninjaX -= 20;
    ninja.style.left = ninjaX + "px";
    footstep.play();
  } else if (e.key === "ArrowRight" && ninjaX < 536) {
    ninjaX += 20;
    ninja.style.left = ninjaX + "px";
    footstep.play();
  }
});

// Game loop
setInterval(() => {
  if (caught) return;

  const ninjaBox = ninja.getBoundingClientRect();
  const lights = document.querySelectorAll(".light");
  const covers = document.querySelectorAll(".cover");

  let exposed = false;
  let hidden = false;

  lights.forEach(light => {
    const box = light.getBoundingClientRect();
    const overlap = !(ninjaBox.right < box.left || ninjaBox.left > box.right);
    if (overlap) exposed = true;
  });

  covers.forEach(cover => {
    const box = cover.getBoundingClientRect();
    const overlap = !(ninjaBox.right < box.left || ninjaBox.left > box.right);
    if (overlap) hidden = true;
  });

  if (exposed && !hidden) {
    stealth = Math.max(0, stealth - 10);
    alert.play();
  } else {
    score += exposed ? 1 : 5;
  }

  updateDisplay();

  // Level 2 activation
  if (score >= 100 && !level2Triggered) {
    level2Triggered = true;
    document.body.style.backgroundImage = "url('https://cdn.jsdelivr.net/gh/AKARuberDuck/ninja-escape/assets/bg-level2.jpg')";
    document.querySelectorAll('.light').forEach(light => {
      light.style.animationDuration = "3s";
      light.style.animationDelay = `${Math.random() * 2}s`;
    });
  }

  if (stealth <= 0) {
    caught = true;
    stealthDisplay.innerHTML = "⚠️ <strong>CAUGHT!</strong>";
  }

}, 1000);

function updateDisplay() {
  const blocks = Math.floor(stealth / 10);
  stealthDisplay.textContent = "Stealth: " + "█".repeat(blocks);
  scoreDisplay.textContent = "Score: " + score;
}
