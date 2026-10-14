import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa";
import {
  SiApachekafka,
  SiCamunda,
  SiCheckmarx,
  SiDocker,
  SiGitlab,
  SiHelm,
  SiHibernate,
  SiJenkins,
  SiKubernetes,
  SiLiquibase,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiSpringboot,
  SiSwagger,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { VscDatabase, VscVscode } from "react-icons/vsc";
import { BarChart3, Cpu, Database, Shield, Workflow, type LucideIcon } from "lucide-react";
import type { SkillName } from "@/lib/content";

type BrandIcon = IconType | LucideIcon;

const techIcons: Record<SkillName, { Icon: BrandIcon; className: string }> = {
  "Java 8 & 17": { Icon: FaJava, className: "text-[#E76F00]" },
  "Node.js": { Icon: SiNodedotjs, className: "text-[#339933]" },
  SQL: { Icon: SiPostgresql, className: "text-[#336791]" },
  Python: { Icon: SiPython, className: "text-[#3776AB]" },
  "Spring Boot": { Icon: SiSpringboot, className: "text-[#6DB33F]" },
  JPA: { Icon: VscDatabase, className: "text-sky-700 dark:text-sky-300" },
  Hibernate: { Icon: SiHibernate, className: "text-[#C17A3A] dark:text-[#E0A36A]" },
  Camunda: { Icon: SiCamunda, className: "text-[#FC5D0D]" },
  Kestra: { Icon: Workflow, className: "text-violet-600 dark:text-violet-300" },
  PostgreSQL: { Icon: SiPostgresql, className: "text-[#336791] dark:text-[#6B9BD2]" },
  "Oracle Database": { Icon: Database, className: "text-[#C74634]" },
  Valkey: { Icon: SiRedis, className: "text-[#FF4438]" },
  "Apache Kafka": { Icon: SiApachekafka, className: "text-zinc-900 dark:text-zinc-100" },
  "REST APIs": { Icon: SiSwagger, className: "text-[#4F8A22] dark:text-[#8FE04A]" },
  Docker: { Icon: SiDocker, className: "text-[#2496ED]" },
  Kubernetes: { Icon: SiKubernetes, className: "text-[#326CE5]" },
  Helm: { Icon: SiHelm, className: "text-[#1B4F9C] dark:text-[#7EB0FF]" },
  "GitLab CI/CD": { Icon: SiGitlab, className: "text-[#E24329]" },
  Jenkins: { Icon: SiJenkins, className: "text-[#D24939]" },
  Liquibase: { Icon: SiLiquibase, className: "text-[#E4002B]" },
  Twistlock: { Icon: Shield, className: "text-teal-600 dark:text-teal-300" },
  Checkmarx: { Icon: SiCheckmarx, className: "text-[#0E6BA8] dark:text-[#5EB6E8]" },
  "Black Duck": { Icon: Shield, className: "text-zinc-800 dark:text-zinc-100" },
  "Next.js": { Icon: SiNextdotjs, className: "text-zinc-900 dark:text-zinc-100" },
  React: { Icon: SiReact, className: "text-[#087EA4] dark:text-[#61DAFB]" },
  TypeScript: { Icon: SiTypescript, className: "text-[#3178C6]" },
  "Tailwind CSS": { Icon: SiTailwindcss, className: "text-[#06B6D4]" },
  Prisma: { Icon: SiPrisma, className: "text-indigo-700 dark:text-indigo-300" },
  "Model Context Protocol": { Icon: Cpu, className: "text-violet-600 dark:text-violet-300" },
  "VS Code Extension API": { Icon: VscVscode, className: "text-[#007ACC]" },
  "MS Power BI": { Icon: BarChart3, className: "text-[#B58B00] dark:text-[#F2C811]" },
  "ETL Pipelines": { Icon: Workflow, className: "text-cyan-700 dark:text-cyan-300" },
};

export function TechIcon({ name }: { name: SkillName }) {
  const { Icon, className } = techIcons[name];
  return <Icon className={`h-4 w-4 shrink-0 ${className}`} aria-hidden />;
}
