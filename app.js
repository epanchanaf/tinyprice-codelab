(() => {
  "use strict";

  // TinyFish se completa antes de iniciar la implementación Android.
  // Reordenamos los artículos en el DOM para que navegación, lectura e impresión
  // sigan el mismo recorrido pedagógico.
  const pageOrder = [
    "step-0", "step-1", "step-7", "step-8", "step-2", "step-3",
    "step-4", "step-5", "step-6", "step-9", "step-10", "step-11",
    "step-12", "step-13", "step-14", "step-15",
  ];
  const orderedPages = pageOrder.map((id) => document.getElementById(id));
  const lesson = document.querySelector(".lesson");
  const lessonControls = document.querySelector(".lesson-controls");
  const orderedFragment = document.createDocumentFragment();
  orderedPages.forEach((page) => orderedFragment.append(page));
  lesson.insertBefore(orderedFragment, lessonControls);
  const pages = [...document.querySelectorAll(".lesson-page")];
  const links = [...document.querySelectorAll("[data-step-link]")];
  const stepLinks = [...document.querySelectorAll(".step-link")];
  const prevButton = document.querySelector("#prevButton");
  const nextButton = document.querySelector("#nextButton");
  const doneCheckbox = document.querySelector("#doneCheckbox");
  const progressValue = document.querySelector("#progressValue");
  const progressLabel = document.querySelector("#progressLabel");
  const progressPercent = document.querySelector("#progressPercent");
  const stepCounter = document.querySelector("#stepCounter");
  const themeButton = document.querySelector("#themeButton");
  const menuButton = document.querySelector("#menuButton");
  const lessonNav = document.querySelector("#lessonNav");
  const navScrim = document.querySelector("#navScrim");
  const toast = document.querySelector("#toast");
  const completeCodelab = document.querySelector("#completeCodelab");
  // Nueva versión para que el progreso previo no marque pasos distintos tras reordenarlos.
  const storageKey = "tinyprice-codelab-state-v4";
  let currentStep = 0;
  let toastTimer;

  const saved = readState();
  const completed = new Set(saved.completed || []);
  const qa = new Set(saved.qa || []);

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  }

  function writeState() {
    localStorage.setItem(storageKey, JSON.stringify({
      currentStep,
      completed: [...completed],
      qa: [...qa],
      theme: document.documentElement.dataset.theme || "light",
    }));
  }

  function stepFromHash() {
    const match = window.location.hash.match(/^#step-(\d+)$/);
    if (!match) return null;
    const value = Number(match[1]);
    return Number.isInteger(value) && value >= 0 && value < pages.length ? value : null;
  }

  function showStep(index, options = {}) {
    currentStep = Math.max(0, Math.min(index, pages.length - 1));
    pages.forEach((page, pageIndex) => page.classList.toggle("active", pageIndex === currentStep));
    stepLinks.forEach((link, linkIndex) => {
      link.classList.toggle("active", linkIndex === currentStep);
      link.classList.toggle("completed", completed.has(linkIndex));
      if (linkIndex === currentStep) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });

    doneCheckbox.checked = completed.has(currentStep);
    prevButton.disabled = currentStep === 0;
    nextButton.disabled = currentStep === pages.length - 1;
    nextButton.textContent = currentStep === pages.length - 2 ? "Finalizar →" : "Siguiente →";
    stepCounter.textContent = `${currentStep + 1} / ${pages.length}`;
    progressLabel.textContent = `Paso ${currentStep + 1} de ${pages.length}`;
    document.title = `${currentStep + 1}. ${pages[currentStep].dataset.title} · TinyPrice Codelab`;

    const navigated = (currentStep / (pages.length - 1)) * 100;
    progressValue.style.width = `${navigated}%`;
    const completion = Math.round((completed.size / pages.length) * 100);
    progressPercent.textContent = `${completion}%`;

    if (!options.keepHash) history.replaceState(null, "", `#step-${currentStep}`);
    if (!options.keepScroll) window.scrollTo({ top: 0, behavior: options.instant ? "auto" : "smooth" });
    closeMenu();
    writeState();
  }

  function setComplete(step, value) {
    if (value) completed.add(step);
    else completed.delete(step);
    showStep(currentStep, { keepScroll: true, keepHash: true, instant: true });
  }

  function closeMenu() {
    lessonNav.classList.remove("open");
    navScrim.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    lessonNav.classList.add("open");
    navScrim.classList.add("open");
    menuButton.setAttribute("aria-expanded", "true");
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  links.forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    showStep(Number(link.dataset.stepLink));
  }));

  prevButton.addEventListener("click", () => showStep(currentStep - 1));
  nextButton.addEventListener("click", () => {
    setComplete(currentStep, true);
    showStep(currentStep + 1);
  });
  doneCheckbox.addEventListener("change", () => setComplete(currentStep, doneCheckbox.checked));

  menuButton.addEventListener("click", () => {
    lessonNav.classList.contains("open") ? closeMenu() : openMenu();
  });
  navScrim.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
    if (event.key === "ArrowRight" && currentStep < pages.length - 1) showStep(currentStep + 1);
    if (event.key === "ArrowLeft" && currentStep > 0) showStep(currentStep - 1);
    if (event.key === "Escape") closeMenu();
  });

  document.querySelectorAll("pre").forEach((pre) => {
    const button = document.createElement("button");
    button.className = "copy-button";
    button.type = "button";
    button.textContent = "Copiar";
    button.setAttribute("aria-label", "Copiar bloque de código");
    button.addEventListener("click", async () => {
      const code = pre.querySelector("code")?.innerText || pre.innerText;
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = "Copiado ✓";
        showToast("Código copiado");
        setTimeout(() => { button.textContent = "Copiar"; }, 1600);
      } catch {
        showToast("No se pudo copiar; selecciona el código manualmente");
      }
    });
    pre.prepend(button);
  });

  document.querySelectorAll("[data-qa]").forEach((checkbox) => {
    checkbox.checked = qa.has(checkbox.dataset.qa);
    checkbox.addEventListener("change", () => {
      checkbox.checked ? qa.add(checkbox.dataset.qa) : qa.delete(checkbox.dataset.qa);
      writeState();
    });
  });

  const preferredTheme = saved.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.dataset.theme = preferredTheme;
  themeButton.addEventListener("click", () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    writeState();
  });

  completeCodelab?.addEventListener("click", () => {
    pages.forEach((_, index) => completed.add(index));
    showStep(pages.length - 1, { keepScroll: true, keepHash: true });
    completeCodelab.textContent = "¡Completado! ✓";
    showToast("Codelab completado al 100%");
  });

  window.addEventListener("hashchange", () => {
    const index = stepFromHash();
    if (index !== null && index !== currentStep) showStep(index, { keepHash: true });
  });

  showStep(stepFromHash() ?? saved.currentStep ?? 0, { keepHash: true, keepScroll: true, instant: true });
})();
