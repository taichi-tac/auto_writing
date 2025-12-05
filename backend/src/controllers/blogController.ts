import { Request, Response } from 'express';
import { RakkoKeywordService } from '../services/rakkoService';
import { GoogleSuggestService } from '../services/googleSuggestService';
import { ClaudeService } from '../services/claudeService';
import {
  BlogGenerationRequest,
  GeneratedBlog,
  GenerationStep,
  GenerationProgress,
} from '../types';

export class BlogController {
  /**
   * リクエストヘッダーまたは環境変数からAPIキーとモデル設定を取得
   */
  private getApiKeys(req: Request): { rakkoKey: string; claudeKey: string; claudeModel: string } {
    // まずヘッダーから取得を試みる
    let rakkoKey = req.headers['x-rakko-api-key'] as string || process.env.RAKKO_API_KEY || '';
    const claudeKey = req.headers['x-claude-api-key'] as string || process.env.ANTHROPIC_API_KEY || '';
    const claudeModel = req.headers['x-claude-model'] as string || 'claude-haiku-4-5-20251001';

    // プレースホルダー値を無効化
    if (rakkoKey && (rakkoKey.includes('your_') || rakkoKey.includes('placeholder') || rakkoKey.includes('example'))) {
      console.log('⚠️ プレースホルダー値を検出しました。Rakko APIキーを無効化します:', rakkoKey.substring(0, 20));
      rakkoKey = '';
    }

    return { rakkoKey, claudeKey, claudeModel };
  }

  /**
   * ブログ記事を生成（7ステップワークフロー）
   */
  async generateBlog(req: Request, res: Response): Promise<void> {
    try {
      const request = req.body as BlogGenerationRequest;

      // APIキーとモデル設定を取得
      const { rakkoKey, claudeKey, claudeModel } = this.getApiKeys(req);

      // デバッグ: APIキーとモデル情報をログ出力
      console.log('=== APIキーとモデル情報 ===');
      console.log('Rakko APIキー (先頭15文字):', rakkoKey ? rakkoKey.substring(0, 15) + '...' : 'なし');
      console.log('Rakko APIキー送信元:', req.headers['x-rakko-api-key'] ? 'リクエストヘッダー' : '環境変数');
      console.log('Claude APIキー (先頭15文字):', claudeKey ? claudeKey.substring(0, 15) + '...' : 'なし');
      console.log('Claude APIキー送信元:', req.headers['x-claude-api-key'] ? 'リクエストヘッダー' : '環境変数');
      console.log('Claude モデル:', claudeModel);
      console.log('==================');

      // Claude APIキーは必須
      if (!claudeKey) {
        res.status(401).json({
          error: 'Claude APIキーが設定されていません',
          message: 'Claude APIキーは必須です。設定画面から登録してください。'
        });
        return;
      }

      // キーワードサービスを初期化（ラッコAPIがなければGoogle Suggest使用）
      const keywordService = rakkoKey
        ? new RakkoKeywordService(rakkoKey)
        : new GoogleSuggestService();

      const claudeService = new ClaudeService(claudeKey, claudeModel);

      console.log(`使用するキーワードサービス: ${rakkoKey ? 'ラッコキーワードAPI' : 'Google Suggest（無料）'}`);

      // バリデーション
      if (!request.keyword) {
        res.status(400).json({ error: 'キーワードは必須です' });
        return;
      }

      // デフォルト値の設定
      const genre = request.genre || request.keyword.split(' ')[0];
      const theme = request.theme || `${request.keyword}について`;
      const authority = request.authority || '';
      const callToAction = request.callToAction || '';

      console.log(`ブログ記事生成開始: ${request.keyword}`);

      // ステップ1: キーワードリサーチ
      console.log('ステップ1: キーワードリサーチ');
      const titles = await keywordService.getTopRankingTitles(request.keyword);
      console.log('取得したタイトル数:', titles.length);
      console.log('タイトル:', titles);

      // ステップ2: 検索意図分析
      console.log('ステップ2: 検索意図分析');
      const searchIntent = await claudeService.analyzeSearchIntent(titles);

      // ステップ3: 記事構成生成
      console.log('ステップ3: 記事構成生成');
      const structure = await claudeService.generateStructure(
        request.keyword,
        genre,
        searchIntent
      );

      // ステップ4: タイトル案生成
      console.log('ステップ4: タイトル案生成');
      const titleCandidates = await claudeService.generateTitles(theme);

      // ステップ5: リード文生成
      console.log('ステップ5: リード文生成');
      const leadText = await claudeService.generateLeadText(
        request.keyword,
        searchIntent,
        structure,
        authority
      );

      // ステップ6: 本文生成
      console.log('ステップ6: 本文生成');
      const body = await claudeService.generateBody(
        request.keyword,
        searchIntent,
        structure
      );

      // ステップ7: まとめ生成
      console.log('ステップ7: まとめ生成');
      const summary = await claudeService.generateSummary(
        request.keyword,
        searchIntent,
        structure,
        callToAction
      );

      // 生成完了
      const generatedBlog: GeneratedBlog = {
        keyword: request.keyword,
        searchIntent,
        structure,
        title: titleCandidates,
        leadText,
        body,
        summary,
        generatedAt: new Date(),
      };

      console.log('ブログ記事生成完了');
      res.json(generatedBlog);

    } catch (error: any) {
      console.error('ブログ生成エラー:', error);
      res.status(500).json({
        error: 'ブログ記事の生成に失敗しました',
        message: error.message,
      });
    }
  }

  /**
   * キーワードサジェスト取得
   */
  async getKeywordSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const { keyword } = req.query;

      if (!keyword || typeof keyword !== 'string') {
        res.status(400).json({ error: 'キーワードは必須です' });
        return;
      }

      // APIキーを取得
      const { rakkoKey } = this.getApiKeys(req);

      // キーワードサービスを初期化（ラッコAPIがなければGoogle Suggest使用）
      const keywordService = rakkoKey
        ? new RakkoKeywordService(rakkoKey)
        : new GoogleSuggestService();

      const suggestions = await keywordService.getSuggestKeywords(keyword);
      res.json({ suggestions });

    } catch (error: any) {
      console.error('サジェスト取得エラー:', error);
      res.status(500).json({
        error: 'サジェストの取得に失敗しました',
        message: error.message,
      });
    }
  }

  /**
   * ヘルスチェック
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}
