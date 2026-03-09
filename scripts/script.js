// ===========================
//   EAM ANÓNIMOS — SCRIPT.JS
// ===========================

// Lista de nombres anónimos generados aleatoriamente
const anonNames = [
  "Anónimo_1148", "Anónimo_4422", "Anónimo_7731", "Anónimo_9953",
  "Anónimo_0087", "Anónimo_6614", "Anónimo_3390", "Anónimo_5577",
  "Anónimo_2233", "Anónimo_8812", "Anónimo_1199", "Anónimo_4456"
];

// Tiempos relativos
const times = [
  "hace un momento", "hace 1min", "hace 3min", "hace 5min"
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Reaccionar a un comentario
function react(btn) {
  const span = btn.querySelector("span");
  const count = parseInt(span.textContent);

  if (btn.classList.contains("reacted")) {
    btn.classList.remove("reacted");
    span.textContent = count - 1;
  } else {
    btn.classList.add("reacted");
    span.textContent = count + 1;
  }
}

// Auto reaccion
function autoReact(card) {
    const btns = card.querySelectorAll(".react-btn span");

    const interval = setInterval(() => {
        const btn = btns[Math.floor(Math.random() * btns.length)];
        btn.textContent = parseInt(btn.textContent) + 1;
    }, 600);

    // Para después de 15 segundos para no inflarse infinito
    setTimeout(() => clearInterval(interval), 15000);
}

// Publicar nuevo comentario
function submitComment() {
  const input = document.getElementById("new-comment-input");
  const text = input.value.trim();

  if (!text) {
    shakeTextarea(input);
    return;
  }

  const commentsSection = document.getElementById("comments");
  const commentCountEl = document.getElementById("comment-count");

  // Crear nueva tarjeta de comentario
  const card = document.createElement("div");
  card.classList.add("comment-card", "new");

  const user = getRandomItem(anonNames);
  const time = getRandomItem(times);

  card.innerHTML = `
    <div class="comment-header">
      <span class="comment-avatar">👤</span>
      <span class="comment-user">${escapeHTML(user)}</span>
      <span class="comment-time">${time}</span>
    </div>
    <p class="comment-text">${escapeHTML(text)}</p>
    <div class="comment-reactions">
      <button class="react-btn" onclick="react(this)">😨 <span>0</span></button>
      <button class="react-btn" onclick="react(this)">👀 <span>0</span></button>
    </div>
  `;

  commentsSection.appendChild(card);

  // Actualizar contador
  const currentCount = parseInt(commentCountEl.textContent);
  commentCountEl.textContent = currentCount + 1;

  // Limpiar textarea
  input.value = "";

  // Scroll suave al nuevo comentario
  setTimeout(() => {

    card.scrollIntoView({ behavior: "smooth", block: "center" });

  }, 100);

  setTimeout(() => {
      autoReact(card);
  }, 2000);
}

// Sacudir textarea si está vacío
function shakeTextarea(el) {
  el.style.transition = "transform 0.08s";

  const shakes = [
    { x: "-6px" }, { x: "6px" }, { x: "-4px" },
    { x: "4px"  }, { x: "0px" }
  ];

  let i = 0;
  const interval = setInterval(() => {
    el.style.transform = `translateX(${shakes[i].x})`;
    i++;
    if (i >= shakes.length) {
      clearInterval(interval);
      el.style.transform = "";
      el.style.borderColor = "var(--accent)";
      setTimeout(() => {
        el.style.borderColor = "";
      }, 1000);
    }
  }, 70);

  el.focus();
}

// Escapar HTML para evitar XSS básico
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Permitir Ctrl+Enter o Cmd+Enter para publicar
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("new-comment-input");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        submitComment();
      }
    });
  }

});
