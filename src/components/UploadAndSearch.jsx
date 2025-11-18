import { useEffect, useMemo, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || ''

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])
  return [value, setValue]
}

function formatPrice(p) {
  if (!p || (p.value == null && !p.currency)) return null
  const val = p.value != null ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(p.value) : null
  return [p.currency, val].filter(Boolean).join(' ')
}

export default function UploadAndSearch() {
  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useLocalStorage('savedItems', [])
  const [envStatus, setEnvStatus] = useState(null)

  useEffect(() => {
    let ignore = false
    const fetchStatus = async () => {
      if (!BACKEND) return
      try {
        const res = await fetch(`${BACKEND}/test`)
        const data = await res.json()
        if (!ignore) setEnvStatus(data?.env || null)
      } catch {
        if (!ignore) setEnvStatus(null)
      }
    }
    fetchStatus()
    // refresh occasionally while on page
    const id = setInterval(fetchStatus, 30000)
    return () => { ignore = true; clearInterval(id) }
  }, [])

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null)
    setResult(null)
    setError('')
  }

  const previewSrc = useMemo(() => {
    if (file) return URL.createObjectURL(file)
    if (imageUrl) return imageUrl
    return null
  }, [file, imageUrl])

  const runAnalyze = async () => {
    if (!file && !imageUrl) {
      setError('Please select a file or paste an image URL')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const form = new FormData()
      if (file) form.append('file', file)
      if (!file && imageUrl) form.append('image_url', imageUrl)
      if (description) form.append('description', description)
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

  const saveItem = (item) => {
    // Normalize saved structure
    const normalized = {
      source: item.source,
      title: item.title,
      url: item.url,
      image: item.image || item.thumbnail || null,
      price: item.price || null,
      location: item.location || '',
      relevanceScore: item.relevanceScore ?? 0,
    }
    const entry = { ...normalized, savedAt: Date.now() }
    setSaved((prev) => {
      const exists = prev.some((p) => p.url === entry.url)
      if (exists) return prev
      return [entry, ...prev].slice(0, 200)
    })
  }

  const clearSaved = () => setSaved([])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 mb-6">
        <h2 className="text-white text-2xl font-semibold mb-2">Identify vintage furniture</h2>
        <p className="text-blue-200/80 text-sm mb-4">Upload a photo or paste an image URL. Optionally add a short description. We’ll detect the designer/model and find live listings across Auctionet, 1stDibs, and Pamono.</p>

        <div className="grid gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input type="file" accept="image/*" onChange={onFileChange} className="text-sm text-blue-100" />
            <span className="text-blue-300/50">or</span>
            <input
              type="url"
              placeholder="https://example.com/image.jpg or a page with an image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full sm:flex-1 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/60 text-blue-100 placeholder-blue-300/40"
            />
          </div>

          <textarea
            placeholder="Optional: add any known details (e.g., likely designer, era, materials)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/60 text-blue-100 placeholder-blue-300/40"
          />

          {previewSrc && (
            <div className="flex items-center gap-3">
              <img src={previewSrc} alt="preview" className="h-28 w-28 object-cover rounded-lg border border-slate-700/60" />
              <div className="text-blue-300/70 text-sm">Preview</div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button onClick={runAnalyze} disabled={loading || (!file && !imageUrl) || !BACKEND} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium transition">
              {loading ? 'Analyzing…' : 'Analyze & Search'}
            </button>
            {!BACKEND && <span className="text-amber-300 text-sm">Backend URL missing. Set VITE_BACKEND_URL in your environment.</span>}
          </div>
        </div>

        {error && <p className="text-red-300 text-sm mt-3 whitespace-pre-wrap">{error}</p>}
      </div>

      {envStatus && (
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 mb-6">
          <p className="text-blue-200/80 text-sm mb-2">Diagnostics</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.entries(envStatus).map(([k, v]) => (
              <span key={k} className={`px-2 py-1 rounded border ${v ? 'border-green-500/40 text-green-300' : 'border-red-500/40 text-red-300'}`}>{k}: {String(v)}</span>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-white text-xl font-semibold mb-2">Marketplace query</h3>
            <p className="text-blue-100 text-lg break-words">{result.query}</p>
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
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold">{source}</h4>
                  {result.results?.[source]?.length > 0 && (
                    <button
                      onClick={() => {
                        const items = result.results[source]
                        items.forEach(saveItem)
                      }}
                      className="text-xs px-2 py-1 rounded bg-slate-900/60 border border-slate-700/60 text-blue-200 hover:bg-slate-900"
                    >Save all</button>
                  )}
                </div>
                <div className="space-y-3 max-h-96 overflow-auto pr-2">
                  {result.results?.[source]?.length ? result.results[source].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                      <a href={item.url} target="_blank" rel="noreferrer" className="block">
                        <div className="flex gap-3">
                          {(item.image || item.thumbnail) && <img src={item.image || item.thumbnail} alt="thumb" className="w-16 h-16 object-cover rounded" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-blue-100 text-sm font-medium line-clamp-2">{item.title}</p>
                            {item.location && <p className="text-blue-300/70 text-xs mt-1 line-clamp-1">{item.location}</p>}
                            {item.relevanceScore != null && <p className="text-blue-300/70 text-[11px] mt-1">Relevance: {item.relevanceScore}</p>}
                            {formatPrice(item.price) && <p className="text-green-300 text-xs mt-1">{formatPrice(item.price)}</p>}
                          </div>
                        </div>
                      </a>
                      <div className="mt-2">
                        <button onClick={() => saveItem({ ...item, source })} className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-500">Save</button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-blue-300/70 text-sm">No results</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-xl font-semibold">Saved items</h3>
          {saved.length > 0 && (
            <button onClick={clearSaved} className="text-xs px-2 py-1 rounded bg-slate-900/60 border border-slate-700/60 text-blue-200 hover:bg-slate-900">Clear all</button>
          )}
        </div>
        {saved.length === 0 ? (
          <p className="text-blue-300/70 text-sm mt-2">Items you save will appear here and persist in your browser.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {saved.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="block p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition border border-slate-700/50">
                <div className="flex gap-3">
                  {(s.image || s.thumbnail) && <img src={s.image || s.thumbnail} alt="thumb" className="w-16 h-16 object-cover rounded" />}
                  <div className="min-w-0">
                    <div className="text-xs text-blue-300/60">{new Date(s.savedAt).toLocaleString()}</div>
                    <div className="text-blue-100 text-sm font-medium line-clamp-2">{s.title || s.url}</div>
                    {formatPrice(s.price) && <div className="text-green-300 text-xs mt-1">{formatPrice(s.price)}</div>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
