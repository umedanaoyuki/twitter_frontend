import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center p-50">
      <h2>お探しのページは見つかりませんでした</h2>
      <p>URLが正しくないか、ページが削除された可能性があります。</p>
      <Link href="/">トップページへ戻る</Link>
    </div>
  )
}