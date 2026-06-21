export function initScrollAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal, .reveal-left, .reveal-scale, .reveal-line").forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "-50px" }
  );

  document.querySelectorAll(".reveal, .reveal-left, .reveal-scale, .reveal-line").forEach((el) => {
    observer.observe(el);
  });
}

export function initCountUp() {
  const counters = document.querySelectorAll<HTMLElement>("[data-count-target]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateCounter = (el: HTMLElement) => {
    const target = parseInt(el.dataset.countTarget ?? "0", 10);
    const suffix = el.dataset.countSuffix ?? "";
    const finalValue = el.dataset.countFinal ?? `${target}${suffix}`;

    if (prefersReducedMotion) {
      el.textContent = finalValue;
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.floor(eased * target)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((el) => observer.observe(el));
}
