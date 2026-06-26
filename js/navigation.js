// 네비게이션: 햄버거 메뉴, 부드러운 스크롤, 스크롤 탑, nav 스타일
const header = document.getElementById("header");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const scrollTopBtn = document.getElementById("scroll-top");

// 햄버거 메뉴 토글 - classList.toggle('active')
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

// 메뉴 링크 클릭 시 부드러운 스크롤 + 모바일 메뉴 닫기
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    navMenu.classList.remove("active");
  });
});

// Hero CTA 버튼도 부드러운 스크롤 적용
document.querySelectorAll('.hero-buttons a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// scroll 이벤트: nav 배경 변경 + 스크롤 탑 버튼 표시
const handleScroll = () => {
  const scrollY = window.scrollY;
  const navThreshold = CONFIG.NAV_SCROLL_THRESHOLD;
  const topThreshold = CONFIG.SCROLL_TOP_THRESHOLD;

  if (header) {
    header.classList.toggle("scrolled", scrollY >= navThreshold);
  }
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle("visible", scrollY >= topThreshold);
  }
};

window.addEventListener("scroll", handleScroll);
handleScroll();

// 스크롤 탑 버튼 클릭
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Intersection Observer: 섹션 fade-in 애니메이션
const fadeElements = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: CONFIG.OBSERVER_THRESHOLD }
);

fadeElements.forEach((el) => observer.observe(el));

// Hero 타이핑 효과 (보너스)
const heroSubtitle = document.getElementById("hero-subtitle");
const typingText = "I help people and brands work smarter through AI automation and vibe coding.";
let charIndex = 0;

const typeWriter = () => {
  if (!heroSubtitle || charIndex > typingText.length) return;
  heroSubtitle.textContent = typingText.slice(0, charIndex);
  charIndex += 1;
  setTimeout(typeWriter, 80);
};

if (heroSubtitle) {
  heroSubtitle.textContent = "";
  setTimeout(typeWriter, 500);
}
