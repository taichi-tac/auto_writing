import axios from 'axios';
import { BlogGenerationRequest, GeneratedBlog } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// LocalStorageからAPIキーとモデル設定を取得してヘッダーに含める
const getHeaders = () => {
  const rakkoKey = localStorage.getItem('rakko_api_key') || '';
  const claudeKey = localStorage.getItem('claude_api_key') || '';
  const claudeModel = localStorage.getItem('claude_model') || 'claude-haiku-4-5-20251001';

  return {
    'X-Rakko-API-Key': rakkoKey,
    'X-Claude-API-Key': claudeKey,
    'X-Claude-Model': claudeModel,
  };
};

export const api = {
  /**
   * ブログ記事を生成
   */
  async generateBlog(request: BlogGenerationRequest): Promise<GeneratedBlog> {
    const response = await axios.post(`${API_BASE_URL}/api/blog/generate`, request, {
      headers: getHeaders(),
    });
    return response.data;
  },

  /**
   * キーワードサジェストを取得
   */
  async getKeywordSuggestions(keyword: string): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/api/blog/suggestions`, {
      params: { keyword },
      headers: getHeaders(),
    });
    return response.data.suggestions;
  },

  /**
   * ヘルスチェック
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blog/health`);
      return response.data.status === 'ok';
    } catch {
      return false;
    }
  },
};
