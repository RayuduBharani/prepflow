export interface SheetProblem {
  slug: string;
}

export interface SheetCategory {
  name: string;
  slug: string;
  problems: SheetProblem[];
}

export interface SheetData {
  name: string;
  slug: string;
  categories: SheetCategory[];
}

export type SheetsData = SheetData[];