
export interface Tender {
  id: number;
  title: string;
  summary: string;
  institution: string;
  fundingMin: number;
  fundingMax: number;
  deadline: string;
  fundingType: FundingType;
  eligibleEntities: string[];
  category: Category;
  fullDescription: string;
  conclusionPoints: string[];
}

export type FundingType = 'Nepovratna sredstva' | 'Subvencija' | 'So-investicija' | 'Vračljiva pomoč' | 'Subvencioniran kredit';
export type Category = 'Tehnologija in inovacije' | 'Zeleni prehod' | 'Kmetijstvo' | 'Turizem' | 'Digitalizacija' | 'Socialno podjetništvo';

export interface FilterState {
  keyword: string;
  fundingType: FundingType | 'all';
  category: Category | 'all';
  institution: string | 'all';
  eligibleEntity: string | 'all';
  deadlineStart: string;
  deadlineEnd: string;
  minFunding: number;
  maxFunding: number;
  showSaved: boolean; // Note: this is now managed by view, not filters
}

export interface SummaryData {
    count: number;
    totalMin: number;
    totalMax: number;
    earliestDeadline: string | null;
    latestDeadline: string | null;
}

export type SortKey = 'deadline' | 'fundingMax';
export type SortDirection = 'asc' | 'desc';

export interface NotificationSettings {
  enabled: boolean;
  frequency: 'weekly' | 'monthly';
  includeTips: boolean;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: FilterState;
  notificationSettings: NotificationSettings;
}

export interface ProfileData {
  companyName: string;
  industry: string;
  companySize: string;
  mainGoals: string;
  projectDescription: string;
}
