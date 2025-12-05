// ブログ記事生成リクエスト
export interface BlogGenerationRequest {
  keyword: string;           // メインキーワード（例: "ダイエット 簡単"）
  genre?: string;            // ジャンル（例: "ダイエット"）
  theme?: string;            // テーマ（例: "おすすめのダイエット方法"）
  authority?: string;        // 権威性（例: "栄養士資格保有"）
  callToAction?: string;     // まとめでのCTA
}

// 検索意図
export interface SearchIntent {
  a: string;                 // 最も多い検索意図
  b: string;                 // 2番目に多い検索意図
  c: string;                 // 3番目に多い検索意図
  distribution: {
    a: number;               // aの該当記事数
    b: number;               // bの該当記事数
    c: number;               // cの該当記事数
  };
}

// 記事構成（見出し）
export interface ArticleStructure {
  h2: string;
  h3?: string[];
}

// 生成されたブログ記事
export interface GeneratedBlog {
  keyword: string;
  searchIntent: SearchIntent;
  structure: ArticleStructure[];
  title: string[];           // タイトル案（5つ）
  leadText: string;          // リード文
  body: string;              // 本文（HTML形式）
  summary: string;           // まとめ
  generatedAt: Date;
}

// ラッコキーワードAPIレスポンス
export interface RakkoKeywordResponse {
  suggestions: string[];
  relatedKeywords: string[];
}

// Google検索結果（タイトル取得用）
export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

// エラーレスポンス
export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
}

// 記事生成ステップ
export enum GenerationStep {
  KEYWORD_RESEARCH = 'keyword_research',
  SEARCH_INTENT = 'search_intent',
  STRUCTURE = 'structure',
  TITLE = 'title',
  LEAD = 'lead',
  BODY = 'body',
  SUMMARY = 'summary',
  COMPLETE = 'complete',
}

// 記事生成進捗
export interface GenerationProgress {
  step: GenerationStep;
  progress: number;          // 0-100
  message: string;
  data?: any;
}
