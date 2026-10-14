/**
 * Profile and project copy taken from Debaprasad Sahoo's resume,
 * plus the personal products already on the site.
 */

import type { YearMonth } from "@/lib/tenure";

export const profile = {
  name: "Debaprasad Sahoo",
  shortName: "Debaprasad",
  role: "Software Engineering Team Lead",
  tagline:
    "Team lead with a track record of designing, building, and running enterprise distributed systems and microservices. The work spans Java and Spring Boot, Node.js, Kafka, and incident automation that brings ML and LLM workflows into operations.",
  email: "sahoo.debaprasad.23@gmail.com",
  phone: "+91 7978355991",
  phoneHref: "tel:+917978355991",
  github: "https://github.com/debapras",
  linkedin: "https://www.linkedin.com/in/debaprasad-sahoo-95a3b4221/",
  resumeHref: "/Debaprasad-Sahoo-Resume.docx",
  resumePdfHref: "/Debaprasad-Sahoo-Resume.pdf",
  location: "Pune, Maharashtra",
  company: "Amdocs Development Centre India LLP",
  certification: "AWS Certified Cloud Practitioner",
} as const;

export const navigation = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Personal" },
  { href: "#skills", label: "Skills" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export const projectFilters = [
  { id: "all", label: "All" },
  { id: "fullstack", label: "Web Apps" },
  { id: "ai", label: "AI & DevTools" },
  { id: "devops", label: "Cloud & DevOps" },
] as const;

export const projects = [
  {
    id: "rootlink",
    category: "fullstack",
    title: "Rootlink Mapping Platform",
    tagline: "Personal · visual canvas and real-time tree hierarchy",
    description:
      "A personal product for mapping tree hierarchies, with live notifications and bulk import into a relational database.",
    architecture:
      "Next.js and React render the canvas and the tree. Prisma stores the hierarchy in PostgreSQL. A WebSocket channel pushes notifications when data changes, and a CSV import path loads rows into that relational model.",
    highlights: [
      "Interactive visual canvas and tree hierarchy mapping.",
      "Real-time notification system via WebSockets.",
      "Dark theme UI with responsive components.",
      "CSV import pipeline and relational data handling.",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "PostgreSQL",
      "WebSockets",
    ],
    codeUrl: "",
    demoUrl: "",
    snippet: {
      language: "TypeScript",
      caption: "Notify subscribers after a hierarchy write",
      code: `async function saveNode(node: { id: string; parentId: string | null }) {
  await prisma.node.upsert({
    where: { id: node.id },
    create: node,
    update: { parentId: node.parentId },
  });
  socket.publish("tree.updated", { id: node.id, parentId: node.parentId });
}`,
    },
  },
  {
    id: "debaai",
    category: "ai",
    title: "DebaAI",
    tagline: "Personal · local coding assistant",
    description:
      "A personal local coding assistant inside VS Code. It indexes the workspace, patches code through MCP tools, and checks the result in a persistent terminal.",
    architecture:
      "DebaAI is a TypeScript VS Code extension. Model Context Protocol tools index the open workspace and apply code patches locally. A persistent PowerShell session stays attached so the assistant can run tests and loop on failures before a change is treated as done.",
    highlights: [
      "Custom local AI coding assistant integrated into VS Code.",
      "MCP tool handlers for workspace indexing and autonomous code patching.",
      "Persistent terminal execution with an automated test verification loop.",
    ],
    stack: [
      "TypeScript",
      "Model Context Protocol (MCP)",
      "VS Code Extension API",
      "PowerShell",
    ],
    codeUrl: "",
    demoUrl: "",
    snippet: {
      language: "TypeScript",
      caption: "MCP tool that patches a file, then checks it in the terminal",
      code: `server.tool("patch_file", async ({ path, diff }) => {
  await workspace.index(vscode.workspace.workspaceFolders);
  await workspace.applyPatch(path, diff);
  return terminal.run("npm test");
});`,
    },
  },
  {
    id: "pipeline",
    category: "devops",
    title: "Cloud DB Sync Pipeline",
    tagline: "Personal · PostgreSQL sync to Cloud SQL",
    description:
      "A personal delivery pipeline that syncs a local PostgreSQL database to Cloud SQL and ships containerized services to Cloud Run.",
    architecture:
      "GitHub Actions dumps the local PostgreSQL schema and data with pg_dump, then applies that dump to Cloud SQL through the Auth Proxy. The same pipeline builds container images and deploys the services to Cloud Run.",
    highlights: [
      "Automated schema and data sync between local PostgreSQL and Cloud SQL.",
      "GitHub Actions pipeline using pg_dump and the Cloud SQL Auth Proxy.",
      "Containerized microservices deployed on Cloud Run.",
    ],
    stack: [
      "Google Cloud Platform",
      "Cloud SQL",
      "Cloud Run",
      "GitHub Actions",
      "PostgreSQL",
      "Docker",
    ],
    codeUrl: "",
    demoUrl: "",
    snippet: {
      language: "YAML",
      caption: "Dump local PostgreSQL and apply it through the Cloud SQL Auth Proxy",
      code: `- name: Sync schema and data
  run: |
    pg_dump --no-owner --format=custom "$LOCAL_DATABASE_URL" > dump.backup
    cloud-sql-proxy "$INSTANCE" &
    pg_restore --clean --no-owner --dbname "$CLOUD_SQL_URL" dump.backup`,
    },
  },
] as const;

export const skillGroups = [
  {
    title: "Languages",
    items: ["Java 8 & 17", "Node.js", "SQL", "Python"],
  },
  {
    title: "Frameworks & tools",
    items: ["Spring Boot", "JPA", "Hibernate", "Camunda", "Kestra"],
  },
  {
    title: "Data & messaging",
    items: ["PostgreSQL", "Oracle Database", "Valkey", "Apache Kafka", "REST APIs"],
  },
  {
    title: "DevOps, cloud & security",
    items: [
      "Docker",
      "Kubernetes",
      "Helm",
      "GitLab CI/CD",
      "Jenkins",
      "Liquibase",
      "Twistlock",
      "Checkmarx",
      "Black Duck",
    ],
  },
  {
    title: "Personal product work",
    items: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "Model Context Protocol",
      "VS Code Extension API",
    ],
  },
  {
    title: "Data Engineering & Analytics",
    items: ["MS Power BI", "ETL Pipelines", "SQL", "Oracle Database"],
  },
] as const;

export type SkillName = (typeof skillGroups)[number]["items"][number];

export const skillLinks: Record<SkillName, string> = {
  "Java 8 & 17": "https://dev.java/",
  "Node.js": "https://nodejs.org/",
  SQL: "https://www.postgresql.org/",
  Python: "https://www.python.org/",
  "Spring Boot": "https://spring.io/projects/spring-boot",
  JPA: "https://jakarta.ee/specifications/persistence/",
  Hibernate: "https://hibernate.org/",
  Camunda: "https://camunda.com/",
  Kestra: "https://kestra.io/",
  PostgreSQL: "https://www.postgresql.org/",
  "Oracle Database": "https://www.oracle.com/database/",
  Valkey: "https://valkey.io/",
  "Apache Kafka": "https://kafka.apache.org/",
  "REST APIs": "https://developer.mozilla.org/en-US/docs/Glossary/REST",
  Docker: "https://www.docker.com/",
  Kubernetes: "https://kubernetes.io/",
  Helm: "https://helm.sh/",
  "GitLab CI/CD": "https://docs.gitlab.com/ee/ci/",
  Jenkins: "https://www.jenkins.io/",
  Liquibase: "https://www.liquibase.com/",
  Twistlock: "https://www.paloaltonetworks.com/prisma/cloud",
  Checkmarx: "https://checkmarx.com/",
  "Black Duck": "https://www.blackduck.com/",
  "Next.js": "https://nextjs.org/",
  React: "https://react.dev/",
  TypeScript: "https://www.typescriptlang.org/",
  "Tailwind CSS": "https://tailwindcss.com/",
  Prisma: "https://www.prisma.io/",
  "Model Context Protocol": "https://modelcontextprotocol.io/",
  "VS Code Extension API": "https://code.visualstudio.com/api",
  "MS Power BI": "https://powerbi.microsoft.com/",
  "ETL Pipelines": "https://en.wikipedia.org/wiki/Extract,_transform,_load",
};

export const roles = [
  {
    id: "amdocs",
    company: "Amdocs Development Centre India LLP",
    logo: { src: "/brands/amdocs.jpg", fit: "badge" as const },
    title: "Software Engineering Team Lead",
    location: "Pune, Maharashtra",
    start: { year: 2021, month: 5 } satisfies YearMonth,
    end: "present" as const,
    period: "May 2021 – Present",
    projects: [
      {
        name: "ItOps",
        tagline: "Intelligent incident automation platform",
        summary:
          "Enterprise platform that automates incident resolution workflows and cuts manual operational work.",
        highlights: [
          "Designed and developed scalable microservices in Java 17 and Spring Boot for real-time incident ingestion, orchestration, validation, and execution.",
          "Built a connector framework for ServiceNow, BMC Helix, and CSV bulk imports.",
          "Developed asynchronous incident workflows on Apache Kafka for lifecycle management, status propagation, and distributed execution tracking.",
          "Wrote automation scripts for infrastructure fixes, log collection, and system remediation.",
          "Stored workflow metadata in PostgreSQL and cached automation rules and runtime state in Valkey.",
          "Worked with AI/ML teams to score pipeline confidence and to orchestrate LLM workflows for incident context and AI-assisted script generation.",
          "Added human-in-the-loop approval for AI-generated remediations, with an execution feedback loop for model learning.",
          "Raised the incident auto-resolution rate, reduced mean time to resolution, and expanded zero-touch coverage for repetitive operational incidents.",
        ],
      },
      {
        name: "EMS & MetroX",
        tagline: "API platform, data, and delivery",
        summary:
          "Modular services and delivery automation for high-impact operational modules.",
        highlights: [
          "Built modular microservices with Spring Boot and Node.js, and standardized API designs. Integration time dropped by 25% and performance improved by 40%.",
          "Optimized PostgreSQL schemas and indexing, cutting query latency by 50%.",
          "Moved schema changes into version-controlled Liquibase changelogs in CI/CD, reducing manual migration errors by 99%.",
          "Built GitLab CI/CD pipelines and Helm charts, with Nexus for artifact management.",
          "Cut infrastructure vulnerabilities by 80% using Twistlock, Checkmarx, and Black Duck.",
          "Architected a global exception handler and custom pagination in Spring Boot, and delivered the Hand-Off feature and Environment Dashboard.",
        ],
      },
    ],
  },
  {
    id: "yusata",
    company: "Yusata Infotech Pvt Ltd",
    logo: { src: "/brands/yusata.png", fit: "wordmark" as const },
    title: "Java Developer",
    location: "Jaipur, Rajasthan",
    start: { year: 2019, month: 8 } satisfies YearMonth,
    end: { year: 2021, month: 5 } satisfies YearMonth,
    period: "Aug 2019 – May 2021",
    projects: [
      {
        name: "YLogApp 2.0",
        tagline: "Fleet management application",
        summary:
          "A fleet product that pulls telematics data into one operational dashboard.",
        highlights: [
          "Integrated third-party telematics and fleet APIs to fetch, store, and visualize real-time operations.",
          "Built a bulk entity engine that parses large Excel datasets and populates the system.",
          "Implemented geofence tracking and alerts with the Google Maps API for real-time asset tracking.",
        ],
      },
    ],
  },
] as const;

export type Project = (typeof projects)[number];
export type ProjectCategory = Project["category"] | "all";
export type Role = (typeof roles)[number];
