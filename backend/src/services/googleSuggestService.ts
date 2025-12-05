import axios from 'axios';

export class GoogleSuggestService {
  /**
   * Googleサジェストキーワードを取得（無料）
   */
  async getSuggestKeywords(keyword: string): Promise<string[]> {
    try {
      // Google Suggest APIエンドポイント
      const url = `http://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(keyword)}`;
      
      const response = await axios.get(url);
      
      // レスポンスは [keyword, [suggestions...]] の形式
      if (Array.isArray(response.data) && response.data.length > 1) {
        return response.data[1] as string[];
      }
      
      return [];
    } catch (error) {
      console.error('Google Suggest API Error:', error);
      // エラー時はダミーデータを返す
      return this.getDummySuggestions(keyword);
    }
  }

  /**
   * 関連キーワードを生成（Google Suggestベース）
   */
  async getRelatedKeywords(keyword: string): Promise<string[]> {
    try {
      const suggestions = await this.getSuggestKeywords(keyword);
      
      // サジェストが少ない場合は、追加のバリエーションを生成
      if (suggestions.length < 5) {
        const additionalKeywords = [
          `${keyword} 方法`,
          `${keyword} やり方`,
          `${keyword} おすすめ`,
          `${keyword} 比較`,
          `${keyword} ランキング`,
        ];
        return [...suggestions, ...additionalKeywords].slice(0, 10);
      }
      
      return suggestions.slice(0, 10);
    } catch (error) {
      console.error('Related keywords error:', error);
      return this.getDummySuggestions(keyword);
    }
  }

  /**
   * 検索上位のタイトルを生成（ダミーデータ）
   * 注: 実際のGoogle検索結果取得には別途APIが必要
   */
  async getTopRankingTitles(keyword: string): Promise<string[]> {
    // Google検索結果の取得は複雑なため、ダミーデータを返す
    return this.getDummyTitles(keyword);
  }

  /**
   * ダミーサジェスト生成
   */
  private getDummySuggestions(keyword: string): string[] {
    return [
      `${keyword} とは`,
      `${keyword} 方法`,
      `${keyword} やり方`,
      `${keyword} おすすめ`,
      `${keyword} 比較`,
      `${keyword} ランキング`,
      `${keyword} メリット`,
      `${keyword} デメリット`,
      `${keyword} 口コミ`,
      `${keyword} 評判`,
    ];
  }

  /**
   * ダミータイトル生成
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
