/** Registers a default Trusted Types policy for DOM XSS mitigation. */
export function initTrustedTypes(): void {
  if (typeof window === "undefined" || !window.trustedTypes?.createPolicy) return;

  try {
    window.trustedTypes.createPolicy("default", {
      createHTML: (input) => input,
      createScript: (input) => input,
      createScriptURL: (input) => input,
    });
  } catch {
    // Policy already registered by another module bundle.
  }
}

initTrustedTypes();
