// バックエンドと同じ型定義
export interface BlogGenerationRequest {
  keyword: string;
  genre?: string;
  theme?: string;
  authority?: string;
  callToAction?: string;
}

export interface SearchIntent {
  a: string;
  b: string;
  c: string;
  distribution: {
    a: number;
    b: number;
    c: number;
  };
}

export interface ArticleStructure {
  h2: string;
  h3?: string[];
}

export interface GeneratedBlog {
  keyword: string;
  searchIntent: SearchIntent;
  structure: ArticleStructure[];
  title: string[];
  leadText: string;
  body: string;
  summary: string;
  generatedAt: Date;
}

export enum GenerationStep {
  IDLE = 'idle',
  KEYWORD_RESEARCH = 'keyword_research',
  SEARCH_INTENT = 'search_intent',
  STRUCTURE = 'structure',
  TITLE = 'title',
  LEAD = 'lead',
  BODY = 'body',
  SUMMARY = 'summary',
  COMPLETE = 'complete',
  ERROR = 'error',
}
