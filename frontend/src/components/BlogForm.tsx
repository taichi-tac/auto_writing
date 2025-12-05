import { useState, FormEvent } from 'react'
import { api } from '../services/api'
import { BlogGenerationRequest, GeneratedBlog, GenerationStep } from '../types'

interface BlogFormProps {
  onBlogGenerated: (blog: GeneratedBlog) => void
  isGenerating: boolean
  setIsGenerating: (value: boolean) => void
  currentStep: GenerationStep
  setCurrentStep: (step: GenerationStep) => void
  setError: (error: string | null) => void
}

// ステップごとの進捗率を計算
function getProgressPercentage(step: GenerationStep): number {
  const stepMap: Record<GenerationStep, number> = {
    [GenerationStep.IDLE]: 0,
    [GenerationStep.KEYWORD_RESEARCH]: 14,
    [GenerationStep.SEARCH_INTENT]: 28,
    [GenerationStep.STRUCTURE]: 42,
    [GenerationStep.TITLE]: 56,
    [GenerationStep.LEAD]: 70,
    [GenerationStep.BODY]: 85,
    [GenerationStep.SUMMARY]: 95,
    [GenerationStep.COMPLETE]: 100,
    [GenerationStep.ERROR]: 0,
  }
  return stepMap[step] || 0
}

export function BlogForm({ onBlogGenerated, isGenerating, setIsGenerating, currentStep, setCurrentStep, setError }: BlogFormProps) {
  const [keyword, setKeyword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!keyword.trim()) {
      setError('キーワードを入力してください')
      return
    }

    setIsGenerating(true)
    setError(null)
    setCurrentStep(GenerationStep.KEYWORD_RESEARCH)

    // 進捗シミュレーション（実際の進捗ではないが、ユーザーに処理が進んでいることを示す）
    const progressSteps = [
      { step: GenerationStep.KEYWORD_RESEARCH, delay: 0 },
      { step: GenerationStep.SEARCH_INTENT, delay: 5000 },
      { step: GenerationStep.STRUCTURE, delay: 10000 },
      { step: GenerationStep.TITLE, delay: 15000 },
      { step: GenerationStep.LEAD, delay: 20000 },
      { step: GenerationStep.BODY, delay: 30000 }, // 本文生成は長い
      { step: GenerationStep.SUMMARY, delay: 120000 }, // 本文完了後
    ]

    const timers: NodeJS.Timeout[] = []
    progressSteps.forEach(({ step, delay }) => {
      const timer = setTimeout(() => setCurrentStep(step), delay)
      timers.push(timer)
    })

    try {
      const blog = await api.generateBlog({ keyword })
      // タイマーをクリア
      timers.forEach(timer => clearTimeout(timer))
      setCurrentStep(GenerationStep.COMPLETE)
      onBlogGenerated(blog)
    } catch (error: any) {
      // タイマーをクリア
      timers.forEach(timer => clearTimeout(timer))
      setCurrentStep(GenerationStep.ERROR)

      // エラーメッセージの内容を確認
      const errorMessage = error.response?.data?.message || error.message || '生成に失敗しました'

      // Claude APIクレジット不足エラーの場合
      if (errorMessage.includes('credit balance') || errorMessage.includes('insufficient')) {
        setError(
          '⚠️ Claude APIのクレジット残高が不足しています。\n' +
          'API設定画面から「Claude APIクレジットの購入方法」を確認して、クレジットを追加してください。\n' +
          '詳細: ' + errorMessage
        )
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">ブログ記事生成</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            キーワード <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="例: ダイエット 簡単"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isGenerating}
          className={`w-full py-4 rounded-lg font-bold text-white ${
            isGenerating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isGenerating ? '生成中...' : 'ブログ記事を生成'}
        </button>
      </form>

      {isGenerating && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-blue-800 font-semibold">記事を生成中...</p>
            </div>

            {/* プログレスバー */}
            <div className="w-full bg-blue-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage(currentStep)}%` }}
              ></div>
            </div>

            {/* ステップ表示 */}
            <div className="text-sm text-blue-700 space-y-1">
              <div className={getProgressPercentage(currentStep) >= 14 ? 'font-semibold' : 'text-blue-400'}>
                {currentStep === GenerationStep.KEYWORD_RESEARCH ? '⏳' : getProgressPercentage(currentStep) > 14 ? '✓' : '○'} ステップ1: キーワードリサーチ
              </div>
              <div className={getProgressPercentage(currentStep) >= 28 ? 'font-semibold' : 'text-blue-400'}>
                {currentStep === GenerationStep.SEARCH_INTENT ? '⏳' : getProgressPercentage(currentStep) > 28 ? '✓' : '○'} ステップ2: 検索意図分析
              </div>
              <div className={getProgressPercentage(currentStep) >= 42 ? 'font-semibold' : 'text-blue-400'}>
                {currentStep === GenerationStep.STRUCTURE ? '⏳' : getProgressPercentage(currentStep) > 42 ? '✓' : '○'} ステップ3: 記事構成生成
              </div>
              <div className={getProgressPercentage(currentStep) >= 56 ? 'font-semibold' : 'text-blue-400'}>
                {currentStep === GenerationStep.TITLE ? '⏳' : getProgressPercentage(currentStep) > 56 ? '✓' : '○'} ステップ4: タイトル案生成
              </div>
              <div className={getProgressPercentage(currentStep) >= 70 ? 'font-semibold' : 'text-blue-400'}>
                {currentStep === GenerationStep.LEAD ? '⏳' : getProgressPercentage(currentStep) > 70 ? '✓' : '○'} ステップ5: リード文生成
              </div>
              <div className={getProgressPercentage(currentStep) >= 85 ? 'font-semibold' : 'text-blue-400'}>
                {currentStep === GenerationStep.BODY ? '⏳' : getProgressPercentage(currentStep) > 85 ? '✓' : '○'} ステップ6: 本文生成（時間がかかります）
              </div>
              <div className={getProgressPercentage(currentStep) >= 95 ? 'font-semibold' : 'text-blue-400'}>
                {currentStep === GenerationStep.SUMMARY ? '⏳' : getProgressPercentage(currentStep) > 95 ? '✓' : '○'} ステップ7: まとめ生成
              </div>
            </div>

            <p className="text-xs text-blue-600 mt-2">
              ※ 本文生成には5〜10分かかる場合があります。そのままお待ちください。
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
