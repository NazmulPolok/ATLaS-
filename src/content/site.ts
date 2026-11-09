import {
  Code2,
  Smartphone,
  ShieldCheck,
  PanelsTopLeft,
  Palette,
  Clapperboard,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  name: string;
  short: string;
  eyebrow: string;
  intro: string;
  icon: LucideIcon;
  color: string;
  problems: string[];
  deliverables: string[];
  projectTypes: string[];
  process: string[];
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "web-development",
    name: "Web development",
    short: "Websites and software built around the way your business works.",
    eyebrow: "Engineering / 01",
    intro:
      "From a sharper first impression to the system behind your operations, we plan and build web experiences made to last.",
    icon: Code2,
    color: "coral",
    problems: [
      "Your website no longer reflects the quality of your work.",
      "Manual processes are slowing your team down.",
      "You need a dependable technical partner to take an idea further.",
    ],
    deliverables: [
      "Business and marketing websites",
      "Web applications and SaaS products",
      "E-commerce and database-driven systems",
      "APIs, integrations, maintenance and improvements",
    ],
    projectTypes: [
      "New product builds",
      "Website redesigns",
      "Internal business tools",
      "Performance and accessibility improvements",
    ],
    process: [
      "Understand the audience, goals and existing systems.",
      "Agree on a practical scope, architecture and milestones.",
      "Design and build in reviewable increments.",
      "Test, launch and plan what comes next.",
    ],
    faqs: [
      {
        q: "Can you work with an existing website?",
        a: "Yes. We can review the current site and agree on a focused improvement plan before recommending a rebuild.",
      },
      {
        q: "Do you provide ongoing support?",
        a: "Support and maintenance can be scoped around the project, release needs and team handover.",
      },
    ],
  },
  {
    slug: "mobile-apps",
    name: "Mobile app development",
    short:
      "Useful mobile experiences, designed for real people and real workflows.",
    eyebrow: "Engineering / 02",
    intro:
      "We shape mobile product ideas into clear, reliable experiences, from the first user flow through implementation and release planning.",
    icon: Smartphone,
    color: "blue",
    problems: [
      "Customers need a more direct way to use your service.",
      "Your team relies on a mobile workflow that is hard to manage.",
      "An existing app needs a clearer experience or more reliable foundation.",
    ],
    deliverables: [
      "Product discovery and mobile UX",
      "Android and iOS app implementation",
      "Backend and API integration",
      "Release preparation, testing and maintenance",
    ],
    projectTypes: [
      "Customer-facing applications",
      "Companion apps for web products",
      "Field and operations tools",
      "Mobile product prototypes",
    ],
    process: [
      "Map user needs and platform requirements.",
      "Prioritize the first useful release.",
      "Prototype key journeys and build in iterations.",
      "Test on target devices and prepare a responsible release.",
    ],
    faqs: [
      {
        q: "Do you build for both iOS and Android?",
        a: "Platform choices are made during discovery based on the audience, requirements and available team capabilities.",
      },
      {
        q: "Can the app connect to our existing system?",
        a: "We can assess APIs and integration requirements during planning.",
      },
    ],
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    short:
      "Practical security thinking woven into products, systems and delivery.",
    eyebrow: "Trust / 03",
    intro:
      "We help teams identify security gaps and make informed improvements, with every review agreed in writing and kept within an authorized scope.",
    icon: ShieldCheck,
    color: "green",
    problems: [
      "You need a clearer view of application security risks.",
      "Access controls or authentication deserve a focused review.",
      "Your team wants security guidance that fits its product and delivery process.",
    ],
    deliverables: [
      "Authorized web application security reviews",
      "Vulnerability assessment and remediation guidance",
      "Authentication and access-control reviews",
      "Configuration hardening and secure architecture consulting",
    ],
    projectTypes: [
      "Pre-release security review",
      "Focused configuration assessment",
      "Secure development guidance",
      "Remediation planning",
    ],
    process: [
      "Confirm written authorization, scope and test boundaries.",
      "Agree on methods, timing and points of contact.",
      "Review the approved systems and validate findings carefully.",
      "Deliver prioritized findings and remediation guidance.",
    ],
    faqs: [
      {
        q: "Do you test systems without authorization?",
        a: "No. Security testing starts only after explicit written authorization and an agreed scope.",
      },
      {
        q: "Can you guarantee a system is secure?",
        a: "No assessment can guarantee security. We provide scoped findings and practical remediation guidance.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX & product design",
    short:
      "Clear journeys and thoughtful interfaces that make products easier to use.",
    eyebrow: "Experience / 04",
    intro:
      "Good product design starts with understanding the people and tasks behind a screen. We turn that context into flows and interfaces your team can build on.",
    icon: PanelsTopLeft,
    color: "violet",
    problems: [
      "Users struggle to complete important tasks.",
      "The product has grown without a consistent interface.",
      "You need to test a product direction before investing in development.",
    ],
    deliverables: [
      "Product discovery and user flows",
      "Wireframes and interactive prototypes",
      "Responsive interface design",
      "Reusable design systems and usability improvements",
    ],
    projectTypes: [
      "New digital products",
      "Product redesigns",
      "SaaS dashboards",
      "Design systems and interface audits",
    ],
    process: [
      "Clarify user needs, business priorities and constraints.",
      "Map the journey and explore possible solutions.",
      "Prototype the important interactions.",
      "Prepare clear, reusable design handoff.",
    ],
    faqs: [
      {
        q: "Can you collaborate with our developers?",
        a: "Yes. We prepare practical handoff materials and can stay involved as the design is implemented.",
      },
      {
        q: "Do we need user research first?",
        a: "We can begin with the evidence you have and recommend research when it will change a product decision.",
      },
    ],
  },
  {
    slug: "branding",
    name: "Branding & graphic design",
    short:
      "A distinctive visual language that stays coherent wherever people meet you.",
    eyebrow: "Identity / 05",
    intro:
      "We help businesses express who they are through purposeful identity systems and visual assets, built for everyday use across digital touchpoints.",
    icon: Palette,
    color: "amber",
    problems: [
      "Your brand looks inconsistent across channels.",
      "The business has changed but its identity has not.",
      "You need visual assets that are easier for the team to use well.",
    ],
    deliverables: [
      "Brand identity and logo systems",
      "Typography and color systems",
      "Marketing and social media creatives",
      "Practical brand guidelines",
    ],
    projectTypes: [
      "New business identity",
      "Brand refresh",
      "Campaign creative",
      "Digital brand system",
    ],
    process: [
      "Learn the business, audience and desired position.",
      "Explore visual directions and agree on a route.",
      "Develop the identity and supporting assets.",
      "Deliver organized files and usage guidance.",
    ],
    faqs: [
      {
        q: "Can you refresh an existing brand?",
        a: "Yes. We can retain recognizable elements while improving clarity and consistency.",
      },
      {
        q: "Will the files be editable?",
        a: "Final formats and working files are agreed during project scoping.",
      },
    ],
  },
  {
    slug: "video-production",
    name: "Video & motion design",
    short: "Focused edits and motion that help your story land with clarity.",
    eyebrow: "Motion / 06",
    intro:
      "We shape raw footage, product stories and visual ideas into concise video content for the places your audience already watches.",
    icon: Clapperboard,
    color: "pink",
    problems: [
      "You have footage but no clear story or finished edit.",
      "Product features are difficult to explain in a static format.",
      "Your video content needs a consistent visual treatment.",
    ],
    deliverables: [
      "Promotional and product video editing",
      "Short-form social video",
      "Motion graphics and explainers",
      "Post-production and visual storytelling",
    ],
    projectTypes: [
      "Launch and campaign videos",
      "Product explainers",
      "Social media series",
      "Brand video content",
    ],
    process: [
      "Agree on the audience, message, format and assets.",
      "Shape the narrative and edit direction.",
      "Build the cut, sound and motion details.",
      "Review and deliver versions for agreed channels.",
    ],
    faqs: [
      {
        q: "Can we provide our own footage?",
        a: "Yes. We can work from supplied footage and identify any gaps before editing begins.",
      },
      {
        q: "Do you create different social formats?",
        a: "We can scope platform-specific cuts and aspect ratios as part of delivery.",
      },
    ],
  },
  {
    slug: "website-maintenance",
    name: "Website maintenance",
    short: "Keep your website updated, dependable and ready for what’s next.",
    eyebrow: "Reliability / 07",
    intro:
      "We help keep existing websites healthy with considered updates, practical fixes and regular checks, scoped to your platform and support needs.",
    icon: Wrench,
    color: "blue",
    problems: [
      "Routine updates have fallen behind or feel risky to apply.",
      "Small bugs and content changes keep interrupting your team.",
      "You need a clearer plan for backups, performance and ongoing care.",
    ],
    deliverables: [
      "Platform, plugin and dependency updates",
      "Bug fixes and small content or interface improvements",
      "Backup and recovery readiness checks",
      "Performance, accessibility and security-conscious reviews",
    ],
    projectTypes: [
      "Ongoing website care",
      "One-time maintenance review",
      "Update and upgrade work",
      "Stability and performance improvements",
    ],
    process: [
      "Review the website, platform, hosting and current access arrangements.",
      "Agree on priorities, boundaries and a practical maintenance scope.",
      "Apply approved changes and check the important user journeys.",
      "Share what changed and recommend the next useful steps.",
    ],
    faqs: [
      {
        q: "Can you maintain a website ATLaS didn’t build?",
        a: "Yes. We start with a review of its platform, code and hosting so the support scope fits the site we’re taking care of.",
      },
      {
        q: "Do you offer a fixed response time or uptime guarantee?",
        a: "Response times and monitoring depend on the agreed support arrangement. We define those expectations before ongoing work begins.",
      },
    ],
  },
];

export const navItems = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
];

export const processSteps = [
  ["01", "Discover", "Get aligned on your goals, users and constraints."],
  ["02", "Plan", "Turn the opportunity into a clear scope and roadmap."],
  ["03", "Design", "Shape the experience before committing to the build."],
  ["04", "Build", "Make progress in focused, reviewable increments."],
  ["05", "Test", "Check the details, edge cases and real-world behavior."],
  [
    "06",
    "Launch & grow",
    "Release with care and make a plan for what follows.",
  ],
];
