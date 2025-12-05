import { useState, useEffect } from 'react'
import { BlogForm } from './components/BlogForm'
import { BlogResult } from './components/BlogResult'
import { ApiSettings } from './components/ApiSettings'
import { GeneratedBlog, GenerationStep } from './types'

function App() {
  const [generatedBlog, setGeneratedBlog] = useState<GeneratedBlog | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState<GenerationStep>(GenerationStep.IDLE)
  const [error, setError] = useState<string | null>(null)

  const [restoredMessage, setRestoredMessage] = useState(false)

  // ページ読み込み時にLocalStorageから前回の結果を復元
  useEffect(() => {
    const savedBlog = localStorage.getItem('last_generated_blog')
    if (savedBlog) {
      try {
        const blog = JSON.parse(savedBlog)
        setGeneratedBlog(blog)
        setRestoredMessage(true)
        console.log('前回の生成結果を復元しました')

        // 5秒後にメッセージを非表示
        setTimeout(() => setRestoredMessage(false), 5000)
      } catch (error) {
        console.error('生成結果の復元に失敗:', error)
      }
    }
  }, [])

  // 生成結果が更新されたらLocalStorageに保存
  const handleBlogGenerated = (blog: GeneratedBlog) => {
    setGeneratedBlog(blog)
    localStorage.setItem('last_generated_blog', JSON.stringify(blog))
    console.log('生成結果をLocalStorageに保存しました')
  }

  // 結果をクリア
  const clearResult = () => {
    setGeneratedBlog(null)
    localStorage.removeItem('last_generated_blog')
    setError(null)
  }

  const handleApiKeysSave = (rakkoKey: string, claudeKey: string) => {
    console.log('APIキーが保存されました')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* API設定ボタン */}
      <ApiSettings onSave={handleApiKeysSave} />

      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            ✍️ Auto Blog Writer
          </h1>
          <p className="text-xl text-gray-600">
            キーワードを入力するだけで、SEO最適化されたブログ記事を自動生成
          </p>
          {restoredMessage && (
            <div className="mt-4 inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              💾 前回の生成結果を復元しました
            </div>
          )}
        </header>

        {/* メインコンテンツ */}
        <div className="max-w-6xl mx-auto">
          <BlogForm
            onBlogGenerated={handleBlogGenerated}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            setError={setError}
          />

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 whitespace-pre-line">❌ {error}</p>
            </div>
          )}

          {generatedBlog && !isGenerating && (
            <>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={clearResult}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  結果をクリア
                </button>
              </div>
              <BlogResult blog={generatedBlog} />
            </>
          )}
        </div>

        {/* フッター */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2024 Auto Blog Writer - Powered by Claude AI & Rakko Keywords</p>
        </footer>
      </div>
    </div>
  )
}

export default App
