import { Router } from 'express';
import { BlogController } from '../controllers/blogController';

export function createBlogRoutes(): Router {
  const router = Router();
  const controller = new BlogController();

  // ブログ記事生成
  router.post('/generate', (req, res) => controller.generateBlog(req, res));

  // キーワードサジェスト取得
  router.get('/suggestions', (req, res) => controller.getKeywordSuggestions(req, res));

  // ヘルスチェック
  router.get('/health', (req, res) => controller.healthCheck(req, res));

  return router;
}
