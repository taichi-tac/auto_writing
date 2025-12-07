import { Router, Request, Response } from 'express';
import { BlogController } from '../controllers/blogController';

export function createBlogRoutes(): Router {
  const router = Router();
  const controller = new BlogController();

  // ブログ記事生成
  router.post('/generate', (req: Request, res: Response) => controller.generateBlog(req, res));

  // キーワードサジェスト取得
  router.get('/suggestions', (req: Request, res: Response) => controller.getKeywordSuggestions(req, res));

  // ヘルスチェック
  router.get('/health', (req: Request, res: Response) => controller.healthCheck(req, res));

  return router;
}
