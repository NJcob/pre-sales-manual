(function () {
  const TOTAL_LESSONS = 8;
  const KEY_UNLOCKED = "unlockedLessons";
  const KEY_COMPLETED = "completedLessons";
  const KEY_LAST_SCORE_PREFIX = "quizScore_"; // e.g., quizScore_1 = 85.0

  // ---------- Storage Helpers ----------
  const jget = (k, def) => {
    try {
      return JSON.parse(localStorage.getItem(k) ?? JSON.stringify(def));
    } catch {
      return def;
    }
  };
  const jset = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  function ensureInit() {
    if (!localStorage.getItem(KEY_UNLOCKED)) jset(KEY_UNLOCKED, [1]);
    if (!localStorage.getItem(KEY_COMPLETED)) jset(KEY_COMPLETED, []);
    // normalize to numbers + unique
    jset(KEY_UNLOCKED, Array.from(new Set(jget(KEY_UNLOCKED, [1]).map(Number))).sort((a,b)=>a-b));
    jset(KEY_COMPLETED, Array.from(new Set(jget(KEY_COMPLETED, []).map(Number))).sort((a,b)=>a-b));
  }

  function getUnlocked() { return jget(KEY_UNLOCKED, [1]).map(Number); }
  function getCompleted() { return jget(KEY_COMPLETED, []).map(Number); }

  function unlockLesson(n) {
    const u = getUnlocked();
    if (!u.includes(n)) {
      u.push(n);
      jset(KEY_UNLOCKED, u.sort((a,b)=>a-b));
    }
  }

  function completeLesson(n) {
    const c = getCompleted();
    if (!c.includes(n)) {
      c.push(n);
      jset(KEY_COMPLETED, c.sort((a,b)=>a-b));
    }
  }

  function pulseIndexUI() {
    if (typeof window.updateLessonStates === "function") window.updateLessonStates();
    if (typeof window.loadProgress === "function") window.loadProgress();
  }

  // ---------- Public API ----------
  // Call this from a quiz page when you have the score.
  // lessonNumber: 1..TOTAL_LESSONS
  // scorePercent: 0..100
  function reportQuizScore(lessonNumber, scorePercent) {
    ensureInit();
    localStorage.setItem(`${KEY_LAST_SCORE_PREFIX}${lessonNumber}`, String(scorePercent));
    const passed = Number(scorePercent) >= 80;

    if (passed) {
      completeLesson(lessonNumber);
      if (lessonNumber < TOTAL_LESSONS) unlockLesson(lessonNumber + 1);
    }

    // Let any open index.html react live (different tab/window)
    try {
      window.dispatchEvent(
        new CustomEvent("course:progress-updated", {
          detail: { lessonNumber, scorePercent, passed },
        })
      );
    } catch {}

    // If we're on index.html right now, refresh UI immediately.
    pulseIndexUI();
  }

  // Expose a global for manual use if needed
  window.CourseBridge = { reportQuizScore };

  // ---------- Auto-detect lesson number on lesson pages ----------
  function detectLessonNumber() {
    // Prefer <body data-lesson="1">
    const fromData = Number(document.body?.dataset?.lesson);
    if (!Number.isNaN(fromData) && fromData > 0) return fromData;

    // Fallback: parse from URL like .../lesson-3.html
    const m = location.pathname.match(/lesson-(\d+)\.html?$/i);
    if (m) return Number(m[1]);

    return null;
  }

  // ---------- Hook into your existing quiz functions (no edits required) ----------
  // Your quiz calls showQuizResults(score, correctAnswers, passed)
  // We wrap it so when passed===true, we report & unlock automatically.
  function hookShowQuizResults() {
    if (typeof window.showQuizResults !== "function") return false;
    if (window.showQuizResults.__bridged) return true;

    const original = window.showQuizResults;
    const lessonNumber = detectLessonNumber();

    window.showQuizResults = function (score, correctAnswers, passed) {
      try {
        original.apply(this, arguments);
      } finally {
        if (lessonNumber && passed === true) {
          // score may be string, normalize
          const pct = Number(score);
          window.CourseBridge.reportQuizScore(lessonNumber, pct);
        }
      }
    };
    window.showQuizResults.__bridged = true;
    return true;
  }

  // Try to hook immediately, then retry a few times (in case quiz script loads after this)
  let tries = 0;
  const maxTries = 40; // ~4s total
  const interval = setInterval(() => {
    tries++;
    if (hookShowQuizResults() || tries >= maxTries) clearInterval(interval);
  }, 100);

  // ---------- Index.html live update when localStorage changes from another tab ----------
  window.addEventListener("storage", (e) => {
    if ([KEY_UNLOCKED, KEY_COMPLETED].includes(e.key)) {
      pulseIndexUI();
    }
    if (e.key && e.key.startsWith(KEY_LAST_SCORE_PREFIX)) {
      pulseIndexUI();
    }
  });

  // ---------- Ensure storage is initialized on load ----------
  document.addEventListener("DOMContentLoaded", ensureInit);
})();