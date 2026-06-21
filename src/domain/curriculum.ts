export const SUPPORTED_LANGUAGES = ["English", "isiZulu", "isiXhosa", "Afrikaans", "Sesotho"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export interface CurriculumFramework {
  id: string;
  country: string;
  title: string;
  description: string;
  phases: string[];
}

const FRAMEWORKS: CurriculumFramework[] = [
  {
    id: "ZA-CAPS",
    country: "ZA",
    title: "CAPS (South Africa)",
    description: "Curriculum and Assessment Policy Statement baseline metadata.",
    phases: ["foundation", "intermediate", "senior", "fet"],
  },
  {
    id: "KE-CBC",
    country: "KE",
    title: "CBC (Kenya)",
    description: "Competency Based Curriculum placeholder for East Africa expansion.",
    phases: ["lower_primary", "upper_primary", "junior_secondary", "senior_secondary"],
  },
  {
    id: "NG-NATIONAL",
    country: "NG",
    title: "Nigeria National Curriculum",
    description: "National basic education curriculum placeholder metadata.",
    phases: ["basic", "junior_secondary", "senior_secondary"],
  },
];

const SUBJECTS_BY_GRADE: Record<string, string[]> = {
  R: ["Home Language", "Mathematics", "Life Skills"],
  "1": ["Home Language", "First Additional Language", "Mathematics", "Life Skills"],
  "7": ["Languages", "Mathematics", "Natural Sciences", "Social Sciences", "Technology"],
  "10": ["Home Language", "First Additional Language", "Mathematics", "Life Sciences", "Physical Sciences"],
  tertiary: ["Academic Literacy", "Discipline Core", "Research Methods", "Digital Skills"],
};

export function listCurriculumFrameworks(country?: string): CurriculumFramework[] {
  if (!country) return FRAMEWORKS;
  return FRAMEWORKS.filter((framework) => framework.country === country.toUpperCase());
}

export function getSubjectsByGrade(grade: string): string[] {
  return SUBJECTS_BY_GRADE[grade] ?? ["Language", "Mathematics", "Science", "Social Studies"];
}

export function getLearningObjectives(subject: string, grade: string): string[] {
  return [
    `Demonstrate foundational competency in ${subject} for grade ${grade}.`,
    `Apply ${subject} concepts to local African and South African contexts.`,
    `Communicate subject understanding in age-appropriate language.`,
  ];
}
