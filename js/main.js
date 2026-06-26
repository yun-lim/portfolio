// main.js - 앱 진입점, 모듈 초기화 확인
document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio initialized");
  console.log(`GitHub user: ${CONFIG.GITHUB_USERNAME}`);
  console.log(`Nav scroll threshold: ${CONFIG.NAV_SCROLL_THRESHOLD}px`);
  console.log(`Scroll top threshold: ${CONFIG.SCROLL_TOP_THRESHOLD}px`);
  console.log(`Observer threshold: ${CONFIG.OBSERVER_THRESHOLD}`);
});
