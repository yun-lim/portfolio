// GitHub API: 상태 관리 → Projects 섹션 렌더링
const projectsContainer = document.getElementById("projects-container");
const projectFilters = document.getElementById("project-filters");

// API 상태 객체 (loading | success | error | empty)
const projectState = {
  status: "loading",
  repos: [],
  filteredRepos: [],
  activeFilter: "all",
  error: null,
};

// 저장소 카드 HTML 생성 - map + 구조분해 할당 + 템플릿 리터럴
const createProjectCard = ({ name, description, html_url, stargazers_count, language }) => {
  const desc = description || "설명이 없습니다.";
  const lang = language || "Unknown";
  return `
    <article class="project-card">
      <h3><a href="${html_url}" target="_blank" rel="noopener noreferrer">${name}</a></h3>
      <p class="project-desc">${desc}</p>
      <div class="project-meta">
        <span><i class="fa-solid fa-star"></i> ${stargazers_count}</span>
        <span><i class="fa-solid fa-code"></i> ${lang}</span>
      </div>
    </article>
  `;
};

// 필터 버튼 렌더링 - forEach + Set으로 언어 목록 추출
const renderFilterButtons = (repos) => {
  if (!projectFilters) return;

  const languages = [...new Set(repos.map((repo) => repo.language).filter(Boolean))];
  if (languages.length === 0) {
    projectFilters.hidden = true;
    return;
  }

  projectFilters.hidden = false;
  projectFilters.innerHTML = `<button type="button" class="filter-btn active" data-filter="all">All</button>`;

  languages.forEach((lang) => {
    projectFilters.innerHTML += `<button type="button" class="filter-btn" data-filter="${lang}">${lang}</button>`;
  });

  projectFilters.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      projectFilters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      projectState.activeFilter = btn.dataset.filter;
      applyFilter();
    });
  });
};

// filter 상태 변경 → filteredRepos 갱신 → 렌더링
const applyFilter = () => {
  const { repos, activeFilter } = projectState;
  projectState.filteredRepos =
    activeFilter === "all" ? repos : repos.filter((repo) => repo.language === activeFilter);
  renderProjects();
};

// 상태에 따라 Projects UI 렌더링
const renderProjects = () => {
  if (!projectsContainer) return;

  const { status, filteredRepos, repos } = projectState;

  if (status === "loading") {
    projectsContainer.innerHTML = `
      <div class="projects-status">
        <div class="spinner" aria-hidden="true"></div>
        <p>로딩 중...</p>
      </div>
    `;
    return;
  }

  if (status === "error") {
    projectsContainer.innerHTML = `
      <div class="projects-status">
        <p>프로젝트를 불러올 수 없습니다.</p>
        <button type="button" class="btn btn-primary retry-btn" id="retry-btn">다시 시도</button>
      </div>
    `;
    document.getElementById("retry-btn")?.addEventListener("click", fetchRepos);
    return;
  }

  if (status === "empty") {
    projectsContainer.innerHTML = `
      <div class="projects-status">
        <p>표시할 프로젝트가 없습니다.</p>
      </div>
    `;
    return;
  }

  const list = filteredRepos.length ? filteredRepos : repos;
  projectsContainer.innerHTML = `<div class="projects-grid">${list.map(createProjectCard).join("")}</div>`;
};

// GitHub API fetch - async/await + try/catch
const fetchRepos = async () => {
  projectState.status = "loading";
  projectState.error = null;
  renderProjects();

  try {
    const url = `https://api.github.com/users/${CONFIG.GITHUB_USERNAME}/repos?sort=updated&per_page=12`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    projectState.repos = data;
    projectState.filteredRepos = data;
    projectState.status = data.length === 0 ? "empty" : "success";

    if (data.length > 0) {
      renderFilterButtons(data);
    }
  } catch (err) {
    projectState.status = "error";
    projectState.error = err;
  }

  renderProjects();
};

document.addEventListener("DOMContentLoaded", fetchRepos);

window.projectsModule = { fetchRepos, projectState };
