
const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

let country = "Германия";
let device = /iPhone|iPad/i.test(navigator.userAgent)
  ? "iPhone"
  : "Android";

const statusText = document.getElementById("status");
const connectButton = document.getElementById("connect");
const extra = document.getElementById("extra");

function updateInfo() {
  document.getElementById("country").textContent = country;
  document.getElementById("device").textContent = device;
}

connectButton.addEventListener("click", () => {
  statusText.textContent = "Демо-режим: VPN не подключён";
  connectButton.textContent = "Пока недоступно";
});

/** @param {string} page */
function showPage(page) {
  extra.innerHTML = "";

  if (page === "home") {
    extra.innerHTML = "<h3>Главная ZENTRA</h3><p>Твой VPN. Твои правила.</p>";
  }

  if (page === "locations") {
    extra.innerHTML = `
      <h3>Выбери страну</h3>
      <button class="option" data-country="Германия">🇩🇪 Германия</button>
      <button class="option" data-country="Нидерланды">🇳🇱 Нидерланды</button>
      <button class="option" data-country="Польша">🇵🇱 Польша</button>
    `;
  }

  if (page === "subscription") {
    extra.innerHTML = `
      <h3>Тарифы ZENTRA</h3>
      <p>START — 99 ₽ / месяц</p>
      <p>PRO — 199 ₽ / месяц</p>
      <p>ULTRA — 299 ₽ / месяц</p>
      <p>Все цены демонстрационные. Оплата недоступна.</p>
    `;
  }

  if (page === "profile") {
    const user = tg?.initDataUnsafe?.user;
    extra.innerHTML = `
      <h3>Мой профиль</h3>
      <p>Имя: ${escapeHTML(user?.first_name || "Гость")}</p>
      <p>Устройство: ${device}</p>
      <p>Страна: ${country}</p>
      <p>Режим: DEMO</p>
    `;
  }
}

/** @param {*} value */
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

document.querySelectorAll("nav button").forEach(button => {
  button.addEventListener("click", () => {
    showPage(button.dataset.page);
  });
});

extra.addEventListener("click", event => {
  const button = event.target.closest("[data-country]");
  if (!button) return;

  country = button.dataset.country;
  updateInfo();
  showPage("locations");
  extra.insertAdjacentHTML(
    "beforeend",
    "<p>Выбрана страна: " + escapeHTML(country) + "</p>"
  );
});

updateInfo();
showPage("home");
