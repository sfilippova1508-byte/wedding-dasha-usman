const DATA = {
  caseNumber: "001",
  officer: { last: "Эскеров", first: "Усман", middle: "Халилович" },
  bride:   { last: "Садовская", first: "Дарья", middle: "Сергеевна" },

  weddingDate: "14 АВГУСТА 2026 Г.",
  venueName: "РЕСТОРАН-ШАТЕР «ВЕРСАЛЬ»",

  schedule: [
    { time: "12:30", text: "Сбор понятых" },
    { time: "13:00", text: "Процедура условно-добровольного освобождения задержанной (выкуп) по адресу: г. Канаш, ул. Садовая д.25" },
    { time: "15:00", text: "Подтверждение задержания и обмен вещественными доказательствами — кольца, 2 шт." },
    { time: "16:00", text: "Банкет в честь успешного завершения операции, далее — свободные манёвры до полной капитуляции усталости." },
  ],

  palette: ["#633F33"],

  rules: [
    "В целях соблюдения регламента мероприятия и обеспечения контролируемой праздничной обстановки постановлено: лица, не достигшие совершеннолетия, к участию в мероприятии не привлекаются. Присутствие детей не предусмотрено форматом операции.",
    "Понятым рекомендуется прибыть вовремя, в установленном дресс-кодом виде и в полной готовности к активному участию в праздничных процессуальных действиях."
  ],

  rsvpDeadline: "30 ИЮЛЯ 2026 Г.",
  rsvpNote:
    "Настоящим подтверждается готовность лично присутствовать при приведении приговора в исполнение и разделить один из важнейших моментов в жизни сторон. Неявка рассматривается как уклонение от участия в историческом событии.",

  // ============================================
  // НАСТРОЙКА GOOGLE FORM
  // ============================================
  // Подробная инструкция в файле: ИНСТРУКЦИЯ_GOOGLE_FORM.md
  //
  // 1. Создай форму в Google Forms с 3 полями:
  //    - ФИО ПОНЯТОГО (короткий ответ)
  //    - АЛКОГОЛЬ (короткий ответ)
  //    - КОММЕНТАРИЙ (абзац)
  //
  // 2. Получи Entry IDs полей (см. инструкцию)
  //
  // 3. Заполни данные ниже:
  
  googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSe-wPMfbVJYqQcbSrdAGeYzJnSG72NL7DFXAi0XHl0tyvCNrg/viewform",
  
  googleFormEntries: {
    fio: "entry.560512365",      // Entry ID для поля "ФИО ПОНЯТОГО"
    alc: "entry.927974663",      // Entry ID для поля "АЛКОГОЛЬ"
    comment: "entry.237855946"   // Entry ID для поля "КОММЕНТАРИЙ"
  }
};

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

// заполнение
setText("caseNumber", (DATA.caseNumber || "").toUpperCase());
setText("officerLast", (DATA.officer.last || "").toUpperCase());
setText("officerFirst", (DATA.officer.first || "").toUpperCase());
setText("officerMiddle", (DATA.officer.middle || "").toUpperCase());
setText("brideLast", (DATA.bride.last || "").toUpperCase());
setText("brideFirst", (DATA.bride.first || "").toUpperCase());
setText("brideMiddle", (DATA.bride.middle || "").toUpperCase());

setText("weddingDate", (DATA.weddingDate || "").toUpperCase());
setText("venueName", (DATA.venueName || "").toUpperCase());
setText("rsvpDeadline", (DATA.rsvpDeadline || "").toUpperCase());
setText("rsvpNote", DATA.rsvpNote);

setText("rule1", DATA.rules?.[0] || "");
setText("rule2", DATA.rules?.[1] || "");

// программа
const schedule = document.getElementById("schedule");
if (schedule) {
  schedule.innerHTML = "";
  DATA.schedule.forEach(item => {
    const row = document.createElement("div");
    row.className = "row anim";
    row.innerHTML = `<div class="time">${item.time}</div><div class="task">${item.text}</div>`;
    schedule.appendChild(row);
  });
}

// палитра
const pal = document.getElementById("palette");
if (pal) {
  pal.innerHTML = "";
  DATA.palette.forEach(c => {
    const b = document.createElement("div");
    b.style.flex = "1";
    b.style.background = c;
    pal.appendChild(b);
  });
}

// Google Form link
const formLink = document.getElementById("googleFormLink");
if (formLink) {
  if (DATA.googleFormUrl) {
    formLink.href = DATA.googleFormUrl;
  } else {
    formLink.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Сначала вставь ссылку на Google Form в script.js → DATA.googleFormUrl");
    });
  }
}

// Анимации: с защитой от дрожания через буферную зону и debounce
const appearEls = document.querySelectorAll(".anim, .anim-x");
let visibilityStates = new Map(); // храним состояние видимости для debounce

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const wasVisible = visibilityStates.get(e.target) || false;
    const isNowVisible = e.isIntersecting;
    
    // Обновляем состояние только если оно действительно изменилось
    if (isNowVisible !== wasVisible) {
      visibilityStates.set(e.target, isNowVisible);
      
      if (isNowVisible) {
        e.target.classList.add("is-visible");
      } else {
        e.target.classList.remove("is-visible");
      }
    }
  });
}, { 
  threshold: 0.2, // порог видимости
  rootMargin: '-30px 0px -30px 0px' // буферная зона для стабильности (уменьшает дрожание)
});

appearEls.forEach(el => {
  io.observe(el);
  visibilityStates.set(el, false);
});

// Кнопка “Открыть”
document.getElementById("openBtn")?.addEventListener("click", () => {
  window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
});

// Музыка
const audio = document.getElementById("bgAudio");
const playBtn = document.getElementById("playBtn");
playBtn?.addEventListener("click", async () => {
  try {
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
      playBtn.textContent = "❚❚";
    } else {
      audio.pause();
      playBtn.textContent = "▶";
    }
  } catch (err) {
    console.log(err);
  }
});

// Функция для извлечения FORM_ID из URL Google Form
function extractFormId(url) {
  if (!url) return null;
  const match = url.match(/\/forms\/d\/e\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Функция для отправки данных в Google Form
async function submitToGoogleForm(formData) {
  const formId = extractFormId(DATA.googleFormUrl);
  if (!formId) {
    throw new Error("Не удалось извлечь ID формы из URL");
  }

  const entries = DATA.googleFormEntries;
  if (!entries.fio || !entries.alc || !entries.comment) {
    throw new Error("Не заполнены entry IDs полей в DATA.googleFormEntries");
  }

  // Формируем URL для отправки
  const submitUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  
  // Формируем данные для отправки
  const params = new URLSearchParams();
  params.append(entries.fio, formData.fio);
  params.append(entries.alc, formData.alc);
  params.append(entries.comment, formData.comment);
  
  // Отправляем данные
  const response = await fetch(submitUrl, {
    method: 'POST',
    mode: 'no-cors', // Google Forms не возвращает CORS заголовки
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString()
  });
  
  // При no-cors мы не можем проверить статус, но запрос отправлен
  return true;
}

// RSVP форма - отправка в Google Form
document.getElementById("rsvpForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn?.textContent;
  
  // Блокируем повторную отправку
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "ОТПРАВКА...";
  }

  const fd = new FormData(form);
  const fio = (fd.get("fio") || "").toString().trim();
  const alc = fd.getAll("alc");
  const comment = (fd.get("comment") || "").toString().trim();

  // Проверяем наличие настроек
  if (!DATA.googleFormUrl) {
    alert("⚠️ Форма не настроена!\n\nОткрой файл script.js и заполни:\n- DATA.googleFormUrl (ссылка на Google Form)\n- DATA.googleFormEntries (Entry IDs полей)\n\nПодробная инструкция в файле: ИНСТРУКЦИЯ_GOOGLE_FORM.md");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
    return;
  }

  try {
    // Отправляем данные
    await submitToGoogleForm({
      fio: fio,
      alc: alc.length ? alc.join(", ") : "—",
      comment: comment || "—"
    });

    // Показываем успешное сообщение
    const noteEl = document.getElementById("rsvpNote");
    if (noteEl) {
      noteEl.textContent = "✓ Данные успешно отправлены! Спасибо за подтверждение.";
      noteEl.style.color = "#4caf50";
    }
    
    // Очищаем форму
    form.reset();
    
    // Через 3 секунды возвращаем обычный текст
    setTimeout(() => {
      if (noteEl) {
        noteEl.textContent = DATA.rsvpNote || "";
        noteEl.style.color = "";
      }
    }, 3000);

  } catch (error) {
    console.error("Ошибка отправки:", error);
    const noteEl = document.getElementById("rsvpNote");
    if (noteEl) {
      noteEl.textContent = `❌ Ошибка: ${error.message}. Проверь настройки в script.js`;
      noteEl.style.color = "#f44336";
    }
    alert(`❌ Ошибка отправки данных\n\n${error.message}\n\nПроверь настройки в script.js:\n- DATA.googleFormUrl\n- DATA.googleFormEntries\n\nСм. инструкцию: ИНСТРУКЦИЯ_GOOGLE_FORM.md`);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
});
function renderCellsFromHidden(id, minCells = 14) {
  const hidden = document.getElementById(id);
  if (!hidden) return;

  const text = (hidden.textContent || "").toUpperCase();
  const host = document.querySelector(`.cells[data-cells="${id}"]`);
  if (!host) return;

  host.innerHTML = "";

  const chars = [...text];
  const total = Math.max(minCells, chars.length);

  for (let i = 0; i < total; i++) {
    const ch = chars[i] || "";
    const cell = document.createElement("span");
    cell.className = "cell" + (ch === " " || ch === "" ? " cell--empty" : "");
    cell.textContent = ch === " " ? "" : ch;
    host.appendChild(cell);
  }
}

["officerLast","officerFirst","officerMiddle","brideLast","brideFirst","brideMiddle"].forEach(id => {
  renderCellsFromHidden(id, 14);
});
