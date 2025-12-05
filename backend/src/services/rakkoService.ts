import axios from 'axios';
import { RakkoKeywordResponse } from '../types';

const RAKKO_API_BASE_URL = 'https://api.related-keywords.com';

export class RakkoKeywordService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * サジェストキーワードを取得
   */
  async getSuggestKeywords(keyword: string): Promise<string[]> {
    try {
      const response = await axios.get(`${RAKKO_API_BASE_URL}/suggest`, {
        params: { keyword },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.data.suggestions || [];
    } catch (error) {
      console.error('Rakko API Error:', error);
      throw new Error('ラッコキーワードAPIからのデータ取得に失敗しました');
    }
  }

  /**
   * 関連キーワードを取得
   */
  async getRelatedKeywords(keyword: string): Promise<string[]> {
    try {
      const response = await axios.get(`${RAKKO_API_BASE_URL}/related`, {
        params: { keyword },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.data.related || [];
    } catch (error) {
      console.error('Rakko API Error:', error);
      throw new Error('関連キーワードの取得に失敗しました');
    }
  }

  /**
   * 検索上位のタイトルを取得（模擬データ）
   * 注: 実際のGoogle検索APIは有料のため、ラッコキーワードのデータを使用
   */
  async getTopRankingTitles(keyword: string): Promise<string[]> {
    try {
      // ラッコキーワードAPIで関連する記事タイトルを取得
      // 実際のAPIエンドポイントに応じて調整が必要
      const response = await axios.get(`${RAKKO_API_BASE_URL}/serp`, {
        params: { keyword },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      // 上位10件のタイトルを返す
      return response.data.titles?.slice(0, 10) || [];
    } catch (error) {
      console.error('Rakko API Error:', error);
      // エラー時はダミーデータを返す（開発用）
      return this.getDummyTitles(keyword);
    }
  }

  /**
   * 開発用ダミータイトル
   */
  private getDummyTitles(keyword: string): string[] {
    return [
      `${keyword}の完全ガイド｜初心者でもわかる方法`,
      `【2024年最新】${keyword}おすすめランキングTOP10`,
      `${keyword}とは？メリット・デメリットを徹底解説`,
      `失敗しない${keyword}の選び方｜プロが教えるコツ`,
      `${keyword}で成功する5つのステップ`,
      `${keyword}の基礎知識｜知っておくべきポイント`,
      `【保存版】${keyword}の始め方｜完全マニュアル`,
      `${keyword}の口コミ・評判まとめ｜実際の効果は？`,
      `${keyword}の注意点とリスク｜対処法も解説`,
      `${keyword}のよくある質問Q&A｜疑問を全て解決`,
    ];
  }
}
