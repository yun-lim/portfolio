// 다크 모드: 테마 상태 → document data-theme → CSS 변수 적용
const getInitialTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved) return saved;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
};

// 테마 상태를 DOM과 localStorage에 반영
const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  const themeIcon = document.getElementById("theme-icon");
  if (themeIcon) {
    themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
};

// DOM 준비 후 테마 아이콘 갱신 및 토글 버튼 연결
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(document.documentElement.dataset.theme || getInitialTheme());
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme || "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }
});

window.themeModule = { applyTheme, getInitialTheme };
