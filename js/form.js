// Contact 폼: 입력 → 유효성 상태 → 에러/성공 메시지 렌더링
const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const messageError = document.getElementById("message-error");
const formSuccess = document.getElementById("form-success");

// 폼 유효성 상태 객체
const formState = {
  name: { valid: true, message: "" },
  email: { valid: true, message: "" },
  message: { valid: true, message: "" },
};

// 이메일 형식 검증
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// 필드별 검증 → formState 갱신
const validateField = (field, value) => {
  if (field === "name") {
    if (!value.trim()) return { valid: false, message: "이름을 입력해주세요." };
  }
  if (field === "email") {
    if (!value.trim()) return { valid: false, message: "이메일을 입력해주세요." };
    if (!isValidEmail(value)) return { valid: false, message: "올바른 이메일 형식이 아닙니다." };
  }
  if (field === "message") {
    if (!value.trim()) return { valid: false, message: "메시지를 입력해주세요." };
  }
  return { valid: true, message: "" };
};

// formState → DOM 에러 메시지 업데이트
const renderFieldError = (field, inputEl, errorEl) => {
  const { valid, message } = formState[field];
  errorEl.textContent = message;
  inputEl.classList.toggle("invalid", !valid);
};

const renderAllErrors = () => {
  renderFieldError("name", nameInput, nameError);
  renderFieldError("email", emailInput, emailError);
  renderFieldError("message", messageInput, messageError);
};

// input 이벤트: 입력 중 해당 필드 에러 제거
const fields = [
  { name: "name", input: nameInput, error: nameError },
  { name: "email", input: emailInput, error: emailError },
  { name: "message", input: messageInput, error: messageError },
];

fields.forEach(({ name, input, error }) => {
  input.addEventListener("input", () => {
    formState[name] = { valid: true, message: "" };
    renderFieldError(name, input, error);
    if (formSuccess) formSuccess.hidden = true;
  });
});

// submit 이벤트: 전체 검증 → 성공 메시지
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (formSuccess) formSuccess.hidden = true;

    formState.name = validateField("name", nameInput.value);
    formState.email = validateField("email", emailInput.value);
    formState.message = validateField("message", messageInput.value);

    renderAllErrors();

    const isFormValid = Object.values(formState).every((f) => f.valid);
    if (isFormValid && formSuccess) {
      formSuccess.hidden = false;
      contactForm.reset();
    }
  });
}
