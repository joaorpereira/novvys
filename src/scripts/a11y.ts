const FOCUSABLE =
  'a[href], button:not([disabled]), select:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) =>
      !element.closest("[hidden], [inert]") &&
      element.getAttribute("aria-hidden") !== "true" &&
      !element.hasAttribute("disabled"),
  );
}

export function trapFocus(container: HTMLElement): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Tab") return;

    const focusable = getFocusableElements(container);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  container.addEventListener("keydown", handleKeyDown);
  return () => container.removeEventListener("keydown", handleKeyDown);
}

export function setBackgroundInert(inert: boolean): void {
  const targets = [
    document.getElementById("main-content"),
    document.querySelector("footer"),
  ];

  for (const target of targets) {
    if (!target) continue;

    if (inert) {
      target.setAttribute("inert", "");
      target.setAttribute("aria-hidden", "true");
    } else {
      target.removeAttribute("inert");
      target.removeAttribute("aria-hidden");
    }
  }
}

export function initSkipLink(): void {
  const skipLink = document.querySelector<HTMLAnchorElement>(".skip-link");
  const main = document.getElementById("main-content");

  if (!skipLink || !main) return;

  skipLink.addEventListener("click", (event) => {
    event.preventDefault();
    main.focus({ preventScroll: false });
  });
}

export function focusFirstElement(container: HTMLElement): void {
  getFocusableElements(container)[0]?.focus();
}
