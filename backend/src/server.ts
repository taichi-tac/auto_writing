import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createBlogRoutes } from './routes/blogRoutes';

// 環境変数の読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// ルート
app.use('/api/blog', createBlogRoutes());

// ルートエンドポイント
app.get('/', (req: express.Request, res: express.Response): void => {
  res.json({
    message: 'Auto Blog Writing API',
    version: '1.0.0',
    endpoints: {
      health: '/api/blog/health',
      generate: 'POST /api/blog/generate',
      suggestions: 'GET /api/blog/suggestions?keyword=xxx',
    },
  });
});

// エラーハンドリング
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction): void => {
  console.error('エラー:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
  console.log(`📝 API エンドポイント: http://localhost:${PORT}/api/blog`);
  console.log(`💡 APIキーはWebインターフェースから設定できます`);
});

export default app;
