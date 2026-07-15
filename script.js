(function ambientField() {
  const field = document.getElementById("ambient");
  const symbols = ["♥", "✦", "♥", "✧"];
  const count = 14;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const size = 10 + Math.random() * 16;
    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = size + "px";
    el.style.setProperty("--drift-x", Math.random() * 120 - 60 + "px");
    const duration = 14 + Math.random() * 14;
    el.style.animationDuration = duration + "s";
    el.style.animationDelay = Math.random() * duration + "s";
    field.appendChild(el);
  }
})();

const styleEl = document.createElement("style");
styleEl.textContent = `@keyframes burstBeat{0%{transform:scale(1);}30%{transform:scale(1.3);}55%{transform:scale(0.94);}100%{transform:scale(1);}}`;
document.head.appendChild(styleEl);

function emojiBurst(clientX, clientY, chars) {
  for (let i = 0; i < chars.length; i++) {
    const spark = document.createElement("span");
    spark.textContent = chars[i % chars.length];
    spark.style.position = "fixed";
    spark.style.left = clientX + "px";
    spark.style.top = clientY + "px";
    spark.style.fontSize = 13 + Math.random() * 10 + "px";
    spark.style.pointerEvents = "none";
    spark.style.zIndex = 999;
    spark.style.transition =
      "transform 900ms cubic-bezier(.2,.8,.3,1), opacity 900ms ease";
    document.body.appendChild(spark);
    requestAnimationFrame(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 45 + Math.random() * 65;
      spark.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 35}px) scale(0.4) rotate(${Math.random() * 180}deg)`;
      spark.style.opacity = "0";
    });
    setTimeout(() => spark.remove(), 950);
  }
}

const heartCluster = document.getElementById("heartCluster");
const dynamicHearts = document.getElementById("dynamicHearts");
const grownLabel = document.getElementById("grownLabel");
const hintBubble = document.getElementById("hintBubble");
let hintDismissed = false;
function dismissHint() {
  if (hintDismissed) return;
  hintDismissed = true;
  hintBubble.classList.add("dismiss");
  setTimeout(() => {
    hintBubble.style.display = "none";
  }, 500);
}
const tintClasses = ["", "tint", "gold-tint"];
let addedCount = 0;
const UNLOCK_AT = 20;
const MAX_HEARTS = 30;
const NS = "http://www.w3.org/2000/svg";
let unlocked = false;

const rewardBtn = document.getElementById("rewardBtn");
const rewardTab = document.getElementById("rewardTab");

function unlockReward() {
  if (unlocked) return;
  unlocked = true;
  rewardBtn.classList.add("show");
  rewardTab.classList.add("show");
  const rect = rewardBtn.getBoundingClientRect();
  emojiBurst(rect.left + rect.width / 2, rect.top, [
    "🎬",
    "🍿",
    "✨",
    "♥",
    "✨",
  ]);
}

function spawnHeart(x, y) {
  if (addedCount >= MAX_HEARTS) return;
  const size = 16 + Math.random() * 20;
  const rot = Math.round(Math.random() * 50 - 25);
  const cls = tintClasses[Math.floor(Math.random() * tintClasses.length)];
  const use = document.createElementNS(NS, "use");
  use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#heartShape");
  use.setAttribute("href", "#heartShape");
  use.setAttribute("x", x - size / 2);
  use.setAttribute("y", y - size / 2);
  use.setAttribute("width", size);
  use.setAttribute("height", size);
  use.setAttribute("class", `cluster-heart ${cls} pop-in idle-float`.trim());
  use.style.setProperty("--fdur", (3.5 + Math.random() * 2).toFixed(2) + "s");
  use.style.setProperty("--frot", rot + "deg");
  use.style.transform = `rotate(${rot}deg)`;
  use.style.transformOrigin = `${x}px ${y}px`;
  dynamicHearts.appendChild(use);
  addedCount++;
  grownLabel.textContent = `+${addedCount} more, and counting`;
  grownLabel.classList.add("show");
  if (addedCount >= UNLOCK_AT) unlockReward();
}

heartCluster.addEventListener("click", (e) => {
  dismissHint();
  const rect = heartCluster.getBoundingClientRect();
  const svgX = ((e.clientX - rect.left) / rect.width) * 150;
  const svgY = ((e.clientY - rect.top) / rect.height) * 140;

  document.querySelectorAll(".cluster-heart").forEach((h) => {
    h.animate(
      [
        { transform: h.style.transform || "scale(1)" },
        { transform: (h.style.transform || "") + " scale(1.18)" },
        { transform: h.style.transform || "scale(1)" },
      ],
      { duration: 480, easing: "cubic-bezier(.3,1.4,.4,1)" },
    );
  });

  spawnHeart(svgX, svgY);
  emojiBurst(e.clientX, e.clientY, ["♥", "♥", "✦"]);
});

const imgBack = document.getElementById("imgBack");
const imgFront = document.getElementById("imgFront");

const photoPool = [
  "images/us1.jpeg",
  "images/us2.jpeg",
  "images/us3.jpeg",
  "images/us4.jpeg",
  "images/us5.jpeg",
  "images/us6.jpeg",
  "images/us7.jpeg",
  "images/us8.jpeg",
];

let currentBack = 0;
let currentFront = 1;

function changePhoto(img, src) {
  img.style.opacity = "0";
  img.style.transform = "scale(0.96)";

  setTimeout(() => {
    img.src = src;
    img.style.opacity = "1";
    img.style.transform = "scale(1)";
  }, 180);
}

function randomPhoto(exclude) {
  let idx;
  do {
    idx = Math.floor(Math.random() * photoPool.length);
  } while (idx === exclude);

  return idx;
}

document.getElementById("shuffleBtn").addEventListener("click", () => {
  currentBack = randomPhoto(currentBack);

  do {
    currentFront = randomPhoto(currentFront);
  } while (currentFront === currentBack);

  changePhoto(imgBack, photoPool[currentBack]);
  changePhoto(imgFront, photoPool[currentFront]);
});

const letterPage = document.getElementById("letterPage");
const rewardPage = document.getElementById("rewardPage");

function switchPage(hideEl, showEl) {
  hideEl.classList.add("fade-out");
  setTimeout(() => {
    hideEl.hidden = true;
    hideEl.classList.remove("fade-out");
    showEl.hidden = false;
    showEl.classList.add("fade-out");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => showEl.classList.remove("fade-out"));
    });
  }, 300);
}

rewardBtn.addEventListener("click", () => switchPage(letterPage, rewardPage));
rewardTab.addEventListener("click", () => {
  if (rewardPage.hidden) {
    switchPage(letterPage, rewardPage);
  }
});
document
  .getElementById("backToLetter")
  .addEventListener("click", () => switchPage(rewardPage, letterPage));

const claimBtn = document.getElementById("claimBtn");
let claimed = false;
claimBtn.addEventListener("click", () => {
  const rect = claimBtn.getBoundingClientRect();
  emojiBurst(rect.left + rect.width / 2, rect.top, ["🎬", "🍿", "✨", "♥"]);
  claimed = !claimed;
  claimBtn.classList.toggle("claimed", claimed);
  claimBtn.textContent = claimed
    ? "🎉 Ticket claimed — movie night is on!"
    : "🎟 Claim this ticket";
});
