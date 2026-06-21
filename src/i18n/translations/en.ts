import type { Translations } from "../types";

export const en: Translations = {
  meta: {
    title: "Novvys — Software house for custom development",
    description:
      "Software house specializing in custom development, data platforms, and high-impact digital products for companies ready to scale.",
  },
  a11y: {
    skipToContent: "Skip to main content",
    mainContent: "Main content",
    socialLinks: "Social media",
    heroImageAlt:
      "Digital ecosystem with laptop, code, cloud, data, and results — Novvys software engineering",
    linkedIn: "Novvys Engineering on LinkedIn (opens in a new tab)",
    gitHub: "Novvys Engineering on GitHub (opens in a new tab)",
    instagram: "Novvys Engineering on Instagram (opens in a new tab)",
  },
  nav: {
    services: "Services",
    solutions: "Solutions",
    cases: "Cases",
    contact: "Contact",
    blog: "Blog",
    cta: "Talk to an expert",
  },
  header: {
    logoName: "NOVVYS",
    tagline: "Software House",
    logoAria: "Novvys Software House — Home",
    navAria: "Main navigation",
    mobileNavAria: "Mobile menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    selectLanguage: "Select language",
    languageMenu: "Available languages",
  },
  hero: {
    badge: "Software House · Software · Data · UX",
    title: "Your software house to build the",
    titleHighlight: "future.",
    subtitle:
      "We are a software house. We build custom software, data platforms, and high-impact digital experiences for companies ready to scale with technology.",
    ctaPrimary: "Explore services",
    ctaSecondary: "View cases",
    highlights: [
      { value: "80+", label: "Projects" },
      { value: "99%", label: "Satisfaction" },
      { value: "6+", label: "Years" },
    ],
    trustLabel: "Trust indicators",
    trustBadges: [
      { title: "99% Satisfaction", subtitle: "Clients recommend us" },
      { title: "80+ Projects", subtitle: "Delivered with excellence" },
      { title: "Senior Team", subtitle: "Certified specialists" },
    ],
    scrollLabel: "Scroll",
    scrollAria: "Scroll to metrics",
  },
  clients: {
    label: "Companies that trust us",
  },
  stats: {
    ariaLabel: "Company metrics",
    items: [
      { label: "Projects delivered" },
      { label: "Client satisfaction" },
      { label: "Years of experience" },
      { label: "Countries served" },
      { label: "Senior team" },
    ],
  },
  services: {
    sectionLabel: "What we do",
    title: "A full-stack software house for companies ready to scale",
    description:
      "As a software house, we combine software engineering, data, and design to deliver digital products that drive real business results.",
    learnMore: "Learn more about",
    items: [
      {
        title: "Software Development",
        description: "Custom web applications and enterprise systems built to scale.",
      },
      {
        title: "Mobile Applications",
        description: "Native and hybrid apps with high-performance UX.",
      },
      {
        title: "Cloud Infrastructure",
        description: "Cloud architecture, DevOps, and resilient secure infrastructure.",
      },
      {
        title: "Integrations & APIs",
        description: "We connect systems, automate workflows, and build digital ecosystems.",
      },
      {
        title: "Data & Intelligence",
        description: "Data pipelines, analytics, and applied AI for strategic decisions.",
      },
      {
        title: "Support & Evolution",
        description: "Continuous maintenance, monitoring, and product evolution.",
      },
    ],
  },
  cases: {
    sectionLabel: "Success cases",
    title: "Results that drive impact",
    viewAll: "View all cases",
    viewCase: "View case",
    items: [
      {
        tag: "Fintech",
        title: "Digital payments platform",
        description: "Full transaction processing system with high availability.",
      },
      {
        tag: "Logistics",
        title: "Logistics management ERP",
        description: "Route automation, real-time tracking, and operational dashboard.",
      },
      {
        tag: "Healthcare",
        title: "Integrated telemedicine",
        description: "Online consultation platform with EHR and HL7 integration.",
      },
    ],
  },
  process: {
    sectionLabel: "How we work",
    title: "An agile, transparent, and efficient process",
    ariaLabel: "Our work process",
    steps: [
      {
        title: "Discovery",
        description: "We deeply understand your business, challenges, and goals.",
      },
      {
        title: "Planning",
        description: "We define architecture, roadmap, and incremental deliveries.",
      },
      {
        title: "Development",
        description: "Agile sprints with continuous delivery and constant feedback.",
      },
      {
        title: "Delivery",
        description: "Secure deployment, rigorous testing, and supported go-live.",
      },
      {
        title: "Evolution",
        description: "Monitoring, optimization, and continuous product improvement.",
      },
    ],
  },
  cta: {
    title: "Let's build something incredible together?",
    subtitle:
      "Talk to our experts and discover how we can accelerate your company's digital transformation.",
    button: "Talk to an expert",
    ariaLabel: "Get in touch",
  },
  footer: {
    desc: "A high-impact software house helping companies scale with custom software, data, and digital products.",
    navigation: "Navigation",
    services: "Services",
    solutions: "Solutions",
    contact: "Contact",
    location: "Belo Horizonte, Brazil",
    copyright: "Novvys Engineering. All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    logoAria: "Novvys Software House",
    serviceLinks: [
      "Software Development",
      "Mobile Applications",
      "Cloud Infrastructure",
      "Integrations & APIs",
      "Data & Intelligence",
      "Support & Evolution",
    ],
    solutionLinks: [
      "Fintech",
      "Logistics",
      "Healthcare",
      "E-commerce",
      "Education",
      "Industry",
    ],
  },
  blog: {
    sectionLabel: "Content & Insights",
    title: "Novvys Blog",
    description:
      "Articles on software engineering, architecture, data, and best practices for teams building high-impact digital products.",
    readMore: "Read article",
    readMinutes: "min read",
    backToBlog: "Back to blog",
    publishedOn: "Published on",
    by: "by",
    allPosts: "All articles",
    noPostsFound: "No articles found.",
    metaTitle: "Blog — Novvys Engineering",
    metaDescription:
      "Articles on software engineering, architecture, data, and technology for teams building high-impact digital products.",
    postMetaTitle: (title: string) => `${title} — Novvys Blog`,
  },
};
