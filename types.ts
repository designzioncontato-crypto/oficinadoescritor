

export interface CustomField {
  id: number;
  title: string;
  value: string;
}

export interface CustomSection {
  id: number;
  title: string;
  fields: CustomField[];
}

export interface CustomData {
  title: string;
  sections: CustomSection[];
}

export interface Article {
  id: number;
  worldId: number;
  title: string;
  category: string;
  content: string;
  color: string;
  customData: CustomData;
  relatedArticleIds: number[];
  relatedCharacterIds: number[];
}

export interface World {
  id: number;
  name: string;
  description: string;
  color: string;
  articles: Article[];
  customData: CustomData;
}

export interface Character {
  id: number;
  name: string;
  age?: number | string;
  worldId?: number | null;
  appearance?: string;
  color: string;
  archetype?: string;
  personality?: string;
  motivation?: string;
  fear?: string;
  secret?: string;
  affiliation?: string;
  socialStatus?: string;
  enemiesAllies?: string;
  powers?: string;
  weaknesses?: string;
  equipment?: string;
  backstory?: string;
  customData: CustomData;
  relatedArticleIds: number[];
}

export interface Plot {
  id: number;
  title: string;
  worldId?: number | null;
  logline?: string;
  act1?: string;
  act2?: string;
  act3?: string;
  threeActStructureHidden?: boolean;
  customData: CustomData;
  relatedArticleIds: number[];
  relatedCharacterIds: number[];
}

export interface Chapter {
  id: number;
  title: string;
  content: string;
}

export interface Project {
  id: number;
  title: string;
  chapters: Chapter[];
}

export type View = 
  | 'DASHBOARD'
  | 'CHARACTERS_LIST'
  | 'CHARACTER_VIEW'
  | 'CHARACTERS_FORM'
  | 'PLOTS_LIST'
  | 'PLOT_VIEW'
  | 'PLOTS_FORM'
  | 'WORLD_BUILDER_LIST'
  | 'WORLD_FORM'
  | 'WORLD_ARTICLES_LIST'
  | 'WORLD_DESCRIPTION_VIEW'
  | 'WORLD_ARTICLE_VIEW'
  | 'WORLD_ARTICLE_FORM'
  | 'DIGITAL_DESK'
  | 'PROJECT_FORM'
  | 'PROJECT_CHAPTERS'
  | 'CHAPTER_EDITOR';

export interface ViewingArticle extends Article {
    worldName?: string;
}