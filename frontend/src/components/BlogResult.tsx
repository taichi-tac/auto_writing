import { GeneratedBlog } from '../types'
import ReactMarkdown from 'react-markdown'

interface BlogResultProps {
  blog: GeneratedBlog
}

export function BlogResult({ blog }: BlogResultProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('コピーしました！')
  }

  const fullArticle = `${blog.title[0]}\n\n${blog.leadText}\n\n${blog.body}\n\n${blog.summary}`

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">生成結果</h2>
        <button
          onClick={() => copyToClipboard(fullArticle)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          全文コピー
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">タイトル案</h3>
          <ul className="space-y-2">
            {blog.title.map((title, idx) => (
              <li key={idx} className="p-3 bg-gray-50 rounded-lg">{title}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">リード文</h3>
          <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">{blog.leadText}</div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">本文</h3>
          <div className="p-4 bg-gray-50 rounded-lg prose max-w-none">
            <ReactMarkdown>{blog.body}</ReactMarkdown>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">まとめ</h3>
          <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">{blog.summary}</div>
        </div>
      </div>
    </div>
  )
}
