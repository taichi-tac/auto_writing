import { useState, useEffect } from 'react'

interface ApiSettingsProps {
  onSave: (rakkoKey: string, claudeKey: string) => void
}

export function ApiSettings({ onSave }: ApiSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [rakkoKey, setRakkoKey] = useState('')
  const [claudeKey, setClaudeKey] = useState('')
  const [claudeModel, setClaudeModel] = useState('claude-haiku-4-5-20251001')
  const [hasKeys, setHasKeys] = useState(false)
  const [showTestMode, setShowTestMode] = useState(false)
  const [showCreditGuide, setShowCreditGuide] = useState(false)
  const [showPricing, setShowPricing] = useState(false)

  useEffect(() => {
    // LocalStorageから既存のキーを読み込み
    const savedRakkoKey = localStorage.getItem('rakko_api_key') || ''
    const savedClaudeKey = localStorage.getItem('claude_api_key') || ''
    const savedClaudeModel = localStorage.getItem('claude_model') || 'claude-haiku-4-5-20251001'
    setRakkoKey(savedRakkoKey)
    setClaudeKey(savedClaudeKey)
    setClaudeModel(savedClaudeModel)
    // Claude APIキーがあればOK（ラッコはオプション）
    setHasKeys(!!savedClaudeKey)
  }, [])

  const handleSave = () => {
    // Claude APIキーは必須
    if (!claudeKey.trim()) {
      alert('Claude APIキーは必須です')
      return
    }

    // LocalStorageに保存
    localStorage.setItem('rakko_api_key', rakkoKey)
    localStorage.setItem('claude_api_key', claudeKey)
    localStorage.setItem('claude_model', claudeModel)
    setHasKeys(!!claudeKey)
    onSave(rakkoKey, claudeKey)
    setIsOpen(false)
    alert('APIキーとモデル設定を保存しました！')
  }

  const handleClear = () => {
    if (confirm('APIキーと設定をクリアしますか？')) {
      localStorage.removeItem('rakko_api_key')
      localStorage.removeItem('claude_api_key')
      localStorage.removeItem('claude_model')
      setRakkoKey('')
      setClaudeKey('')
      setClaudeModel('claude-3-5-sonnet-20240620')
      setHasKeys(false)
      alert('APIキーと設定をクリアしました')
    }
  }

  return (
    <>
      {/* 設定ボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 right-4 px-4 py-2 rounded-lg font-semibold shadow-lg ${
          hasKeys
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-yellow-500 text-white hover:bg-yellow-600 animate-pulse'
        }`}
      >
        {hasKeys ? '⚙️ API設定' : '⚠️ APIキーを設定'}
      </button>

      {/* モーダル */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-8 pb-4">
              <h2 className="text-2xl font-bold text-gray-800">API設定</h2>
            </div>

            <div className="px-8 overflow-y-auto flex-1">
              <div className="space-y-6 pb-6">
              {/* ラッコキーワードAPI */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ラッコキーワードAPIキー <span className="text-gray-400 font-normal">（オプション）</span>
                </label>
                <input
                  type="password"
                  value={rakkoKey}
                  onChange={(e) => setRakkoKey(e.target.value)}
                  placeholder="空欄の場合は無料のGoogle Suggestを使用"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-green-600">
                    💡 空欄OK：無料のGoogle Suggest APIを使用します
                  </p>
                  <p className="text-xs text-gray-500">
                    有料版: <a href="https://related-keywords.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://related-keywords.com/</a> （月額990円〜）
                  </p>
                </div>
              </div>

              {/* Claude API */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Anthropic Claude APIキー <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={claudeKey}
                  onChange={(e) => setClaudeKey(e.target.value)}
                  placeholder="sk-ant-... で始まるAPIキーを入力"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  取得方法: <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://console.anthropic.com/</a>
                </p>
              </div>

              {/* Claude モデル選択 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Claude モデル選択 <span className="text-red-500">*</span>
                </label>
                <select
                  value={claudeModel}
                  onChange={(e) => setClaudeModel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5（最安・最速）- 1記事約3〜10円</option>
                  <option value="claude-sonnet-4-5-20250929">Claude Sonnet 4.5（推奨）- 1記事約15〜45円</option>
                  <option value="claude-opus-4-1-20250805">Claude Opus 4.1（最高品質）- 1記事約75〜225円</option>
                </select>
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p>💡 <strong>Haiku（デフォルト）</strong>: 最も安価で高速。シンプルな記事向け</p>
                  <p>⚖️ <strong>Sonnet</strong>: 品質とコストのバランスが良い</p>
                  <p>🌟 <strong>Opus</strong>: 最高品質だが高価。重要な記事向け</p>
                </div>
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                  ⚠️ <strong>注意:</strong> APIアカウントによって利用可能なモデルが異なります。モデル選択でエラーが出る場合は、Haikuモデル（動作確認済み）をお試しください。
                </div>
              </div>

              {/* 注意事項 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>注意:</strong> APIキーはブラウザのLocalStorageに保存されます。このアプリは信頼できる環境でのみ使用してください。
                </p>
              </div>

              {/* テストモード案内（アコーディオン） */}
              <div className="border border-purple-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowTestMode(!showTestMode)}
                  className="w-full bg-purple-50 hover:bg-purple-100 p-4 text-left flex items-center justify-between"
                >
                  <span className="text-sm font-semibold text-purple-800">
                    🧪 テストモード（開発用）
                  </span>
                  <span className="text-purple-600">{showTestMode ? '▲' : '▼'}</span>
                </button>
                {showTestMode && (
                  <div className="p-4 bg-white border-t border-purple-200">
                    <p className="text-xs text-purple-700 mb-2">
                      APIキーなしでも動作確認が可能です：
                    </p>
                    <ul className="text-xs text-purple-700 space-y-1 ml-4 list-disc">
                      <li>キーワード取得: Google Suggest（無料）が自動で使用されます</li>
                      <li>記事生成: 現在はClaude APIキーが必須ですが、将来ダミーモードを追加予定</li>
                    </ul>
                    <p className="text-xs text-purple-600 mt-2 font-semibold">
                      ※ 本番記事を生成するにはClaude APIキーとクレジット残高が必要です
                    </p>
                  </div>
                )}
              </div>

              {/* Claude APIクレジット購入ガイド（アコーディオン） */}
              <div className="border border-green-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowCreditGuide(!showCreditGuide)}
                  className="w-full bg-green-50 hover:bg-green-100 p-4 text-left flex items-center justify-between"
                >
                  <span className="text-sm font-semibold text-green-800">
                    💳 Claude APIクレジットの購入方法
                  </span>
                  <span className="text-green-600">{showCreditGuide ? '▲' : '▼'}</span>
                </button>
                {showCreditGuide && (
                  <div className="p-4 bg-white border-t border-green-200">
                    <ol className="text-xs text-green-700 space-y-1 ml-4 list-decimal">
                      <li><a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Anthropic Console</a> にアクセス</li>
                      <li>左メニューから「Settings」→「Billing」を選択</li>
                      <li>「Add Credit Balance」または「Purchase Credits」をクリック</li>
                      <li>$5〜の金額を選択して購入（クレジットカード払い）</li>
                    </ol>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-green-600">
                        💡 目安: $10で約200〜300記事分のクレジットになります
                      </p>
                      <p className="text-xs text-amber-600 font-semibold">
                        ⚠️ クレジット残高不足エラーが出た場合はこちらで追加購入してください
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 料金情報（アコーディオン） */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowPricing(!showPricing)}
                  className="w-full bg-blue-50 hover:bg-blue-100 p-4 text-left flex items-center justify-between"
                >
                  <span className="text-sm font-semibold text-blue-800">
                    💰 料金について
                  </span>
                  <span className="text-blue-600">{showPricing ? '▲' : '▼'}</span>
                </button>
                {showPricing && (
                  <div className="p-4 bg-white border-t border-blue-200">
                    <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                      <li>ラッコキーワード: 月額990円〜（オプション、無料のGoogle Suggestも利用可）</li>
                      <li>Claude API: 1記事あたり約15〜45円（必須・従量課金）</li>
                    </ul>
                    <p className="text-xs text-green-700 mt-2">
                      ✅ 最小コスト: Claude APIのみで月数百円から利用可能
                    </p>
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* ボタン */}
            <div className="p-8 pt-4 border-t border-gray-200 bg-white">
              <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
              >
                保存
              </button>
              {hasKeys && (
                <button
                  onClick={handleClear}
                  className="px-6 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700"
                >
                  クリア
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400"
              >
                キャンセル
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
