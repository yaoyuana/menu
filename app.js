const menuGrid = document.getElementById("menu-grid");
const randomBtn = document.getElementById("random-btn");
const againBtn = document.getElementById("again-btn");
const spotlight = document.getElementById("spotlight");
const heroImage = document.getElementById("hero-image");
const menuCount = document.getElementById("menu-count");

let DISHES = [];
let spinning = false;
let lastWinnerId = null;
let cameraTween = null;

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderMenu() {
  menuGrid.innerHTML = DISHES.map(
    (dish) => `
      <article class="dish" role="listitem" tabindex="0" data-id="${dish.id}">
        <div class="dish-media">
          <img src="${escapeHtml(dish.image)}" alt="${escapeHtml(dish.name)}" loading="lazy" />
        </div>
        <div class="dish-copy">
          <h3>${escapeHtml(dish.name)}</h3>
          <div class="dish-meta">
            <span>${escapeHtml(dish.type)}</span>
          </div>
        </div>
      </article>
    `
  ).join("");

  menuCount.textContent = `共 ${DISHES.length} 道家常菜，点一张看大图，或交给随机缘分。`;
}

function getDishCards() {
  return [...menuGrid.querySelectorAll(".dish")];
}

function clearScanState() {
  getDishCards().forEach((card) => {
    card.classList.remove("is-scanning", "is-winner", "is-dimmed");
  });
  document.body.classList.remove("is-camera-tracking");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pickWinner() {
  const pool =
    DISHES.length > 1
      ? DISHES.filter((d) => d.id !== lastWinnerId)
      : DISHES;
  return pool[Math.floor(Math.random() * pool.length)];
}

function cancelCameraTween() {
  if (cameraTween) {
    cancelAnimationFrame(cameraTween);
    cameraTween = null;
  }
}

/** Smoothly move the viewport so the card sits near the center. */
function followCard(card, duration = 180) {
  if (!card) return Promise.resolve();

  cancelCameraTween();
  document.body.classList.add("is-camera-tracking");

  const rect = card.getBoundingClientRect();
  const targetY =
    window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
  const startY = window.scrollY;
  const delta = targetY - startY;

  if (Math.abs(delta) < 2) {
    return Promise.resolve();
  }

  // Fast jumps: snap; later steps: ease
  if (duration < 70) {
    window.scrollTo(0, targetY);
    return Promise.resolve();
  }

  const start = performance.now();
  return new Promise((resolve) => {
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      window.scrollTo(0, startY + delta * eased);
      if (t < 1) {
        cameraTween = requestAnimationFrame(tick);
      } else {
        cameraTween = null;
        resolve();
      }
    };
    cameraTween = requestAnimationFrame(tick);
  });
}

async function runRandomPick() {
  if (spinning || !DISHES.length) return;
  spinning = true;

  closeSpotlight();
  clearScanState();
  randomBtn.classList.add("is-spinning");
  randomBtn.querySelector(".btn-label").textContent = "挑选中…";

  const cards = getDishCards();
  const winner = pickWinner();
  lastWinnerId = winner.id;
  const winnerCard = cards.find((c) => c.dataset.id === winner.id);

  // Build a jumping path across the grid, ending on the winner
  const sequence = [];
  const hops = 14 + Math.floor(Math.random() * 10);
  for (let i = 0; i < hops; i += 1) {
    sequence.push(cards[Math.floor(Math.random() * cards.length)]);
  }
  if (winnerCard) sequence.push(winnerCard);

  for (let i = 0; i < sequence.length; i += 1) {
    const card = sequence[i];
    cards.forEach((c) => c.classList.remove("is-scanning"));
    card.classList.add("is-scanning");

    const progress = i / Math.max(1, sequence.length - 1);
    const delay = 45 + progress * progress * 260;
    const camDuration = 40 + progress * progress * 280;

    // Camera follows each highlight
    await Promise.all([followCard(card, camDuration), sleep(delay)]);
  }

  cards.forEach((c) => {
    c.classList.remove("is-scanning");
    if (c.dataset.id === winner.id) c.classList.add("is-winner");
    else c.classList.add("is-dimmed");
  });

  if (winnerCard) {
    await followCard(winnerCard, 420);
  }

  heroImage.src = winner.image;
  await sleep(280);
  openSpotlight(winner);

  randomBtn.classList.remove("is-spinning");
  randomBtn.querySelector(".btn-label").textContent = "随机菜单";
  document.body.classList.remove("is-camera-tracking");
  spinning = false;
}

function openSpotlight(dish) {
  document.getElementById("spotlight-image").src = dish.image;
  document.getElementById("spotlight-image").alt = dish.name;
  document.getElementById("spotlight-title").textContent = dish.name;
  document.getElementById("spotlight-desc").textContent =
    dish.type ? `分类：${dish.type}` : "家常私厨";
  document.getElementById("spotlight-type").textContent = dish.type || "";
  document.getElementById("spotlight-tag").textContent = "今日缘分";

  spotlight.hidden = false;
  document.body.classList.add("is-locked");
}

function closeSpotlight() {
  spotlight.hidden = true;
  document.body.classList.remove("is-locked");
}

function onDishActivate(id) {
  const dish = DISHES.find((d) => d.id === id);
  if (!dish || spinning) return;
  clearScanState();
  const cards = getDishCards();
  cards.forEach((c) => {
    if (c.dataset.id === id) c.classList.add("is-winner");
    else c.classList.add("is-dimmed");
  });
  lastWinnerId = id;
  heroImage.src = dish.image;
  const card = cards.find((c) => c.dataset.id === id);
  if (card) followCard(card, 320);
  openSpotlight(dish);
}

menuGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".dish");
  if (!card) return;
  onDishActivate(card.dataset.id);
});

menuGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".dish");
  if (!card) return;
  event.preventDefault();
  onDishActivate(card.dataset.id);
});

spotlight.addEventListener("click", (event) => {
  if (event.target.matches("[data-close]")) closeSpotlight();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !spotlight.hidden) closeSpotlight();
});

randomBtn.addEventListener("click", () => runRandomPick());
againBtn.addEventListener("click", () => {
  closeSpotlight();
  runRandomPick();
});

async function boot() {
  const res = await fetch("./menu.json");
  const raw = await res.json();
  DISHES = raw.map((item, index) => ({
    id: `dish-${index}`,
    name: item.desc,
    type: item.type || "",
    image: item.link,
  }));

  renderMenu();
  const first = shuffle(DISHES)[0];
  if (first) heroImage.src = first.image;
}

boot().catch((err) => {
  console.error(err);
  menuCount.textContent = "菜单加载失败，请刷新重试。";
});
