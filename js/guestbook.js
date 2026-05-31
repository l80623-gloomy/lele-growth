(function () {
  "use strict";

  const form = document.getElementById("guestbook-form");
  const listEl = document.getElementById("guestbook-list");
  const loadingEl = document.getElementById("guestbook-loading");
  const emptyEl = document.getElementById("guestbook-empty");
  const setupEl = document.getElementById("guestbook-setup");
  const formStatusEl = document.getElementById("guestbook-form-status");
  const submitBtn = document.getElementById("guestbook-submit");
  const nameInput = document.getElementById("guestbook-name");
  const messageInput = document.getElementById("guestbook-message");
  const countEl = document.getElementById("message-count");

  if (!form || !listEl) return;

  const COLLECTION =
    typeof GUESTBOOK_COLLECTION !== "undefined"
      ? GUESTBOOK_COLLECTION
      : "guestbook_messages";

  function isConfigReady() {
    return (
      typeof firebaseConfig !== "undefined" &&
      firebaseConfig.apiKey &&
      !String(firebaseConfig.apiKey).includes("YOUR_")
    );
  }

  function setFormStatus(text, type) {
    if (!formStatusEl) return;
    formStatusEl.textContent = text;
    formStatusEl.className = "guestbook-form-status";
    if (type) formStatusEl.classList.add(`is-${type}`);
  }

  function setLoading(show) {
    if (loadingEl) loadingEl.hidden = !show;
  }

  function avatarForName(name) {
    const n = name.trim();
    if (/阿公|爺爺|外公/.test(n)) return "👴";
    if (/阿嬤|奶奶|外婆|姥姥/.test(n)) return "👵";
    if (/爸爸|爸比|老爸/.test(n)) return "👨";
    if (/媽媽|媽咪|老媽/.test(n)) return "👩";
    if (/哥哥|弟弟|叔叔|舅舅/.test(n)) return "👦";
    if (/姐姐|妹妹|阿姨|姑姑/.test(n)) return "👧";
    return "💛";
  }

  function formatTime(timestamp) {
    if (!timestamp) return "剛剛";
    const date =
      typeof timestamp.toDate === "function"
        ? timestamp.toDate()
        : new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderMessages(docs) {
    listEl.innerHTML = "";
    if (!docs.length) {
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;

    docs.forEach((doc) => {
      const data = doc.data();
      const name = (data.name || "家人").trim();
      const message = (data.message || "").trim();
      const timeStr = formatTime(data.createdAt);

      const card = document.createElement("blockquote");
      card.className = "guestbook-card";
      card.innerHTML = `
        <header class="guestbook-card-header">
          <footer class="guestbook-author">
            <span class="guestbook-avatar" aria-hidden="true">${avatarForName(name)}</span>
            <cite>${escapeHtml(name)}</cite>
          </footer>
          <time class="guestbook-time" datetime="">${escapeHtml(timeStr)}</time>
        </header>
        <p class="guestbook-message">${escapeHtml(message)}</p>
      `;
      const timeEl = card.querySelector("time");
      if (timeEl && data.createdAt?.toDate) {
        timeEl.setAttribute("datetime", data.createdAt.toDate().toISOString());
      }
      listEl.appendChild(card);
    });
  }

  function showSetupMode() {
    if (setupEl) setupEl.hidden = false;
    if (form) form.hidden = true;
    setLoading(false);
    if (emptyEl) emptyEl.hidden = true;
  }

  function updateCharCount() {
    if (countEl && messageInput) {
      countEl.textContent = String(messageInput.value.length);
    }
  }

  if (messageInput) {
    messageInput.addEventListener("input", updateCharCount);
    updateCharCount();
  }

  if (!isConfigReady()) {
    showSetupMode();
    return;
  }

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  db.collection(COLLECTION)
    .orderBy("createdAt", "desc")
    .onSnapshot(
      (snapshot) => {
        setLoading(false);
        renderMessages(snapshot.docs);
      },
      (err) => {
        console.error(err);
        setLoading(false);
        setFormStatus("無法載入留言，請確認 Firebase 設定與網路連線。", "error");
      }
    );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setFormStatus("");

    const name = nameInput?.value.trim() || "";
    const message = messageInput?.value.trim() || "";

    if (!name) {
      setFormStatus("請填寫稱謂。", "error");
      nameInput?.focus();
      return;
    }
    if (!message) {
      setFormStatus("請寫下想說的話。", "error");
      messageInput?.focus();
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    setFormStatus("送出中…", "");

    try {
      await db.collection(COLLECTION).add({
        name,
        message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      form.reset();
      updateCharCount();
      setFormStatus("祝福已送出，謝謝你！❤️", "success");
      nameInput?.focus();
    } catch (err) {
      console.error(err);
      setFormStatus("送出失敗，請稍後再試。", "error");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
