import { useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || ''

export default function UploadAndSearch() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null)
    setResult(null)
    setError('')
  }

  const runAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${BACKEND}/analyze`, { method: 'POST', body: form })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 mb-6">
        <h2 className="text-white text-2xl font-semibold mb-4">Identify vintage furniture</h2>
        <p className="text-blue-200/80 text-sm mb-4">Upload a photo. We’ll detect designer, model, and find live listings across Auctionet, 1stDibs, and Pamono.</p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input type="file" accept="image/*" onChange={onFileChange} className="text-sm text-blue-100" />
          <button onClick={runAnalyze} disabled={!file || loading} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium transition">
            {loading ? 'Analyzing…' : 'Analyze & Search'}
          </button>
        </div>
        {error && <p className="text-red-300 text-sm mt-3">{error}</p>}
      </div>

      {result && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-white text-xl font-semibold mb-2">Marketplace query</h3>
            <p className="text-blue-100 text-lg">{result.query}</p>
            <div className="mt-3 text-blue-200/80 text-sm grid sm:grid-cols-2 gap-2">
              <div><span className="text-blue-300">Designer:</span> {result.attribution?.designer || '—'}</div>
              <div><span className="text-blue-300">Manufacturer:</span> {result.attribution?.manufacturer || '—'}</div>
              <div><span className="text-blue-300">Model:</span> {result.attribution?.model || '—'}</div>
              <div><span className="text-blue-300">Year:</span> {result.attribution?.year || '—'}</div>
              <div><span className="text-blue-300">Style:</span> {result.attribution?.style || '—'}</div>
              <div><span className="text-blue-300">Confidence:</span> {result.attribution?.confidence ?? '—'}</div>
            </div>
            {result.attribution?.notes && (
              <p className="mt-3 text-blue-200/80 text-sm">Notes: {result.attribution.notes}</p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {['Auctionet','1stDibs','Pamono'].map(source => (
              <div key={source} className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-4">
                <h4 className="text-white font-semibold mb-3">{source}</h4>
                <div className="space-y-3 max-h-96 overflow-auto pr-2">
                  {result.results?.[source]?.length ? result.results[source].map((item, idx) => (
                    <a key={idx} href={item.url} target="_blank" rel="noreferrer" className="block p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition border border-slate-700/50">
                      <div className="flex gap-3">
                        {item.thumbnail && <img src={item.thumbnail} alt="thumb" className="w-16 h-16 object-cover rounded" />}
                        <div>
                          <p className="text-blue-100 text-sm font-medium line-clamp-2">{item.title}</p>
                          {item.snippet && <p className="text-blue-300/70 text-xs mt-1 line-clamp-2">{item.snippet}</p>}
                          {item.price && <p className="text-green-300 text-xs mt-1">{item.price}</p>}
                        </div>
                      </div>
                    </a>
                  )) : (
                    <p className="text-blue-300/70 text-sm">No results</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
