import Anthropic from '@anthropic-ai/sdk';
import { SearchIntent, ArticleStructure } from '../types';
import fs from 'fs';
import path from 'path';

export class ClaudeService {
  private client: Anthropic;
  private prompts: Map<string, string> = new Map();
  private model: string;

  constructor(apiKey: string, model: string = 'claude-haiku-4-5-20251001') {
    this.client = new Anthropic({
      apiKey,
      timeout: 300000, // 5分（本文生成は時間がかかるため）
    });
    this.model = model;
    this.loadPrompts();
  }

  /**
   * プロンプトファイルを読み込み
   */
  private loadPrompts() {
    const promptsDir = path.join(__dirname, '../..', 'ライティング');

    console.log('📁 プロンプトディレクトリ:', promptsDir);
    console.log('📁 ディレクトリ存在確認:', fs.existsSync(promptsDir));

    try {
      const files = [
        '1.検索意図.txt',
        '2.ブログ記事構成.txt',
        '3.タイトル案出力.txt',
        '4.リード文作成.txt',
        '5.本文作成.txt',
        '6.まとめ作成.txt',
      ];

      files.forEach((file) => {
        const filePath = path.join(promptsDir, file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          this.prompts.set(file, content);
          console.log(`✅ 読み込み成功: ${file} (${content.length}文字)`);
        } else {
          console.log(`❌ ファイルが見つかりません: ${filePath}`);
        }
      });

      console.log(`📄 読み込まれたプロンプト数: ${this.prompts.size}`);
    } catch (error) {
      console.error('プロンプトファイルの読み込みエラー:', error);
    }
  }

  /**
   * Claude APIを呼び出し
   */
  private async callClaude(prompt: string): Promise<string> {
    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: prompt,
        }],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return content.text;
      }
      
      throw new Error('Unexpected response type');
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('記事生成に失敗しました');
    }
  }

  /**
   * ステップ1: 検索意図を分析
   */
  async analyzeSearchIntent(titles: string[]): Promise<SearchIntent> {
    const promptTemplate = this.prompts.get('1.検索意図.txt') || '';
    
    // タイトルリストを挿入
    const titleList = titles.map((title, i) => `・${title}`).join('\n');
    const prompt = promptTemplate.replace(
      /・【「記事\d+」のタイトルが入ります】/g,
      ''
    ).replace('#記事タイトル', `#記事タイトル\n${titleList}`);

    const response = await this.callClaude(prompt);
    
    // レスポンスをパースして検索意図を抽出
    return this.parseSearchIntent(response);
  }

  /**
   * 検索意図のパース
   */
  private parseSearchIntent(response: string): SearchIntent {
    const lines = response.split('\n');
    const intent: Partial<SearchIntent> = { distribution: { a: 0, b: 0, c: 0 } };

    lines.forEach((line) => {
      if (line.startsWith('a:')) {
        intent.a = line.replace('a:', '').trim();
      } else if (line.startsWith('b:')) {
        intent.b = line.replace('b:', '').trim();
      } else if (line.startsWith('c:')) {
        intent.c = line.replace('c:', '').trim();
      } else if (line.includes('【a】該当記事数：')) {
        intent.distribution!.a = parseInt(line.match(/\d+/)?.[0] || '0');
      } else if (line.includes('【b】該当記事数：')) {
        intent.distribution!.b = parseInt(line.match(/\d+/)?.[0] || '0');
      } else if (line.includes('【c】該当記事数：')) {
        intent.distribution!.c = parseInt(line.match(/\d+/)?.[0] || '0');
      }
    });

    return intent as SearchIntent;
  }

  /**
   * ステップ2: 記事構成を生成
   */
  async generateStructure(
    keyword: string,
    genre: string,
    searchIntent: SearchIntent
  ): Promise<ArticleStructure[]> {
    const promptTemplate = this.prompts.get('2.ブログ記事構成.txt') || '';

    console.log('🏗️  記事構成生成開始');

    const searchIntentText = `a:${searchIntent.a}\nb:${searchIntent.b}\nc:${searchIntent.c}\nまた、検索意図の重要度はa＞b＞cとする。`;

    const prompt = promptTemplate
      .replace(/{ジャンル}/g, genre)
      .replace(/{キーワード}/g, keyword)
      .replace(/{検索意図}/g, searchIntentText);

    const response = await this.callClaude(prompt);

    console.log('📄 Claude APIレスポンス（記事構成）:');
    console.log(response);
    console.log('--- レスポンス終了 ---');

    const structure = this.parseStructure(response);
    console.log(`✅ パース結果: ${structure.length}個の見出し`);

    return structure;
  }

  /**
   * 記事構成のパース
   */
  private parseStructure(response: string): ArticleStructure[] {
    const structure: ArticleStructure[] = [];
    const lines = response.split('\n');
    let currentH2: ArticleStructure | null = null;

    console.log(`📋 パース開始: ${lines.length}行`);

    lines.forEach((line) => {
      const h2Match = line.match(/^h2[：:]\s*(.+)/);
      const h3Match = line.match(/^\s*h3[：:]\s*(.+)/);

      if (h2Match) {
        if (currentH2) {
          structure.push(currentH2);
        }
        currentH2 = { h2: h2Match[1].trim(), h3: [] };
      } else if (h3Match && currentH2) {
        currentH2.h3?.push(h3Match[1].trim());
      }
    });

    if (currentH2) {
      structure.push(currentH2);
    }

    console.log(`📋 パース完了: ${structure.length}個のh2見出し`);

    return structure;
  }

  /**
   * ステップ3: タイトル案を生成
   */
  async generateTitles(theme: string): Promise<string[]> {
    const promptTemplate = this.prompts.get('3.タイトル案出力.txt') || '';
    const prompt = promptTemplate.replace(/{テーマ}/g, theme);

    const response = await this.callClaude(prompt);
    
    // 5つのタイトル案を抽出
    return response
      .split('\n')
      .filter((line) => line.trim().length > 0 && !line.startsWith('#'))
      .slice(0, 5);
  }

  /**
   * ステップ4: リード文を生成
   */
  async generateLeadText(
    keyword: string,
    searchIntent: SearchIntent,
    structure: ArticleStructure[],
    authority: string
  ): Promise<string> {
    const promptTemplate = this.prompts.get('4.リード文作成.txt') || '';
    
    const searchIntentText = `a:${searchIntent.a}\nb:${searchIntent.b}\nc:${searchIntent.c}\nまた、検索意図の重要度はa＞b＞cとする。`;
    const structureText = this.formatStructure(structure);
    
    const prompt = promptTemplate
      .replace(/{キーワード}/g, keyword)
      .replace(/{検索意図}/g, searchIntentText)
      .replace(/{権威性}/g, authority)
      .replace(/{記事構成}/g, structureText);

    return await this.callClaude(prompt);
  }

  /**
   * ステップ5: 本文を生成
   */
  async generateBody(
    keyword: string,
    searchIntent: SearchIntent,
    structure: ArticleStructure[]
  ): Promise<string> {
    const promptTemplate = this.prompts.get('5.本文作成.txt') || '';

    console.log('📝 本文生成開始');
    console.log('構造配列の長さ:', structure.length);
    console.log('構造配列:', JSON.stringify(structure, null, 2));

    const searchIntentText = `a:${searchIntent.a}\nb:${searchIntent.b}\nc:${searchIntent.c}\nまた、検索意図の重要度はa＞b＞cとする。`;
    const structureText = this.formatStructure(structure);

    let fullBody = '';
    let sectionCount = 0;

    // 各見出しごとに本文を生成
    for (const section of structure) {
      if (section.h2.includes('まとめ')) {
        console.log(`⏭️  スキップ: ${section.h2}`);
        continue; // まとめは別途生成
      }

      sectionCount++;
      console.log(`📄 セクション${sectionCount}を生成中: ${section.h2}`);

      const sectionText = `h2：${section.h2}\n${section.h3?.map(h3 => `  h3：${h3}`).join('\n') || ''}`;

      const prompt = promptTemplate
        .replace(/{キーワード}/g, keyword)
        .replace(/{検索意図}/g, searchIntentText)
        .replace(/{記事構成}/g, structureText)
        .replace(/{出力したい目次箇所}/g, sectionText);

      const sectionBody = await this.callClaude(prompt);
      console.log(`✅ セクション${sectionCount}生成完了（文字数: ${sectionBody.length}）`);
      fullBody += sectionBody + '\n\n';
    }

    console.log(`📝 本文生成完了（総文字数: ${fullBody.length}、セクション数: ${sectionCount}）`);
    return fullBody;
  }

  /**
   * ステップ6: まとめを生成
   */
  async generateSummary(
    keyword: string,
    searchIntent: SearchIntent,
    structure: ArticleStructure[],
    callToAction: string
  ): Promise<string> {
    const promptTemplate = this.prompts.get('6.まとめ作成.txt') || '';
    
    const searchIntentText = `a:${searchIntent.a}\nb:${searchIntent.b}\nc:${searchIntent.c}\nまた、検索意図の重要度はa＞b＞cとする。`;
    const structureText = this.formatStructure(structure);
    
    const prompt = promptTemplate
      .replace(/{キーワード}/g, keyword)
      .replace(/{検索意図}/g, searchIntentText)
      .replace(/{本記事読了後にユーザーにとってほしい行動}/g, callToAction)
      .replace(/{記事構成}/g, structureText);

    return await this.callClaude(prompt);
  }

  /**
   * 記事構成をテキスト形式に変換
   */
  private formatStructure(structure: ArticleStructure[]): string {
    return structure
      .map((section) => {
        const h3Text = section.h3?.map(h3 => `  h3：${h3}`).join('\n') || '';
        return `h2：${section.h2}\n${h3Text}`;
      })
      .join('\n\n');
  }
}
