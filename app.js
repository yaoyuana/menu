const DISHES = [
  {
    id: "truffle-risotto",
    name: "黑松露慢炖risotto",
    desc: "帕玛森乳化酱、低温黄油、鲜刨黑松露。",
    price: "¥168",
    time: "28 min",
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "wagyu",
    name: "和牛炭火炙烧",
    desc: "外焦里嫩，配烟熏海盐与山葵青柠汁。",
    price: "¥288",
    time: "18 min",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "lobster",
    name: "黄油龙虾意面",
    desc: "波士顿龙虾、番茄白兰地酱、细扁意面。",
    price: "¥228",
    time: "24 min",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "duck",
    name: "橙香慢烤鸭胸",
    desc: "焦糖橙皮酱、烤时蔬、脆皮还原。",
    price: "¥198",
    time: "32 min",
    image:
      "https://images.unsplash.com/photo-1432139509613-5c4255815697?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "tuna",
    name: "炙烤金枪鱼刺身",
    desc: "芝麻壳、芥末油、微炙表面留鲜红中心。",
    price: "¥158",
    time: "12 min",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "soup",
    name: "松茸清汤",
    desc: "高山松茸、昆布高汤、薄切白葱花。",
    price: "¥98",
    time: "15 min",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dessert",
    name: "焦糖布丁与莓果",
    desc: "香草荚布丁、脆糖壳、当季莓果。",
    price: "¥78",
    time: "10 min",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "salad",
    name: "烟熏牛油果沙拉",
    desc: "烤坚果、酸豆、柑橘油醋汁。",
    price: "¥88",
    time: "8 min",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  },
];

const menuGrid = document.getElementById("menu-grid");
const randomBtn = document.getElementById("random-btn");
const againBtn = document.getElementById("again-btn");
const spotlight = document.getElementById("spotlight");
const heroImage = document.getElementById("hero-image");

let spinning = false;
let lastWinnerId = null;

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderMenu() {
  menuGrid.innerHTML = DISHES.map(
    (dish) => `
      <article class="dish" role="listitem" tabindex="0" data-id="${dish.id}">
        <div class="dish-media">
          <img src="${dish.image}" alt="${dish.name}" loading="lazy" />
        </div>
        <div class="dish-copy">
          <h3>${dish.name}</h3>
          <p>${dish.desc}</p>
          <div class="dish-meta">
            <span>${dish.price}</span>
            <span>${dish.time}</span>
          </div>
        </div>
      </article>
    `
  ).join("");
}

function getDishCards() {
  return [...menuGrid.querySelectorAll(".dish")];
}

function clearScanState() {
  getDishCards().forEach((card) => {
    card.classList.remove("is-scanning", "is-winner", "is-dimmed");
  });
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

async function runRandomPick(fromButton = true) {
  if (spinning) return;
  spinning = true;

  if (fromButton) {
    document.getElementById("menu")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  closeSpotlight(false);
  clearScanState();
  randomBtn.classList.add("is-spinning");
  randomBtn.querySelector(".btn-label").textContent = "挑选中…";

  const cards = getDishCards();
  const winner = pickWinner();
  lastWinnerId = winner.id;

  const sequence = [];
  const rounds = 10 + Math.floor(Math.random() * 6);
  for (let i = 0; i < rounds; i += 1) {
    sequence.push(cards[i % cards.length]);
  }
  const winnerCard = cards.find((c) => c.dataset.id === winner.id);
  sequence.push(winnerCard);

  for (let i = 0; i < sequence.length; i += 1) {
    cards.forEach((c) => c.classList.remove("is-scanning"));
    sequence[i].classList.add("is-scanning");
    const progress = i / (sequence.length - 1);
    const delay = 55 + progress * progress * 220;
    await sleep(delay);
  }

  cards.forEach((c) => {
    c.classList.remove("is-scanning");
    if (c.dataset.id === winner.id) {
      c.classList.add("is-winner");
    } else {
      c.classList.add("is-dimmed");
    }
  });

  heroImage.src = winner.image;
  await sleep(420);
  openSpotlight(winner);

  randomBtn.classList.remove("is-spinning");
  randomBtn.querySelector(".btn-label").textContent = "随机菜单";
  spinning = false;
}

function openSpotlight(dish) {
  document.getElementById("spotlight-image").src = dish.image;
  document.getElementById("spotlight-image").alt = dish.name;
  document.getElementById("spotlight-title").textContent = dish.name;
  document.getElementById("spotlight-desc").textContent = dish.desc;
  document.getElementById("spotlight-price").textContent = dish.price;
  document.getElementById("spotlight-time").textContent = dish.time;
  document.getElementById("spotlight-tag").textContent = "今日缘分";

  spotlight.hidden = false;
  document.body.classList.add("is-locked");
}

function closeSpotlight(restore = true) {
  spotlight.hidden = true;
  document.body.classList.remove("is-locked");
  if (restore) {
    // keep winner highlight briefly after close
  }
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
  if (event.target.matches("[data-close]")) {
    closeSpotlight();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !spotlight.hidden) {
    closeSpotlight();
  }
});

randomBtn.addEventListener("click", () => runRandomPick(true));
againBtn.addEventListener("click", () => runRandomPick(false));

renderMenu();

// Soft shuffle of hero among dishes on load for variety
const boot = shuffle(DISHES)[0];
heroImage.src = boot.image;
