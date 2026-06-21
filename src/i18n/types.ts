export interface Translations {
  meta: {
    title: string;
    description: string;
  };
  a11y: {
    skipToContent: string;
    socialLinks: string;
    decorativeGlobe: string;
    linkedIn: string;
    gitHub: string;
    instagram: string;
  };
  nav: {
    services: string;
    solutions: string;
    cases: string;
    about: string;
    blog: string;
    careers: string;
    cta: string;
  };
  header: {
    logoAria: string;
    navAria: string;
    mobileNavAria: string;
    openMenu: string;
    closeMenu: string;
    selectLanguage: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    highlights: { value: string; label: string }[];
    scrollLabel: string;
    scrollAria: string;
  };
  clients: {
    label: string;
  };
  stats: {
    ariaLabel: string;
    items: { label: string }[];
  };
  services: {
    sectionLabel: string;
    title: string;
    description: string;
    learnMore: string;
    items: { title: string; description: string }[];
  };
  cases: {
    sectionLabel: string;
    title: string;
    viewAll: string;
    viewCase: string;
    items: { tag: string; title: string; description: string }[];
  };
  process: {
    sectionLabel: string;
    title: string;
    ariaLabel: string;
    steps: { title: string; description: string }[];
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
    ariaLabel: string;
  };
  footer: {
    desc: string;
    navigation: string;
    services: string;
    solutions: string;
    contact: string;
    location: string;
    copyright: string;
    privacy: string;
    terms: string;
    logoAria: string;
    serviceLinks: string[];
    solutionLinks: string[];
  };
}
