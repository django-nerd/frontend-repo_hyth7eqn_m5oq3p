import { useRef, useState } from 'react'
import UploadScreen from './components/UploadScreen'
import MarketplacePage from './components/MarketplacePage'
import SimilarItemsPage from './components/SimilarItemsPage'

const BACKEND = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  const [screen, setScreen] = useState('upload') // upload | market | similar
  const [imageUrl, setImageUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const onChoose = () => fileRef.current?.click()
  const onTake = () => alert('Camera access is not available in this preview. Use Choose from Library.')

  const onFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAnalyzing(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${BACKEND}/analyze`, { method: 'POST', body: form })
      if (!res.ok) throw new Error(await res.text())
      // For now we don't render results on this screen; navigate to Similar to view sample layout
      // In a follow-up we can pipe the results to the dedicated page/state.
      setScreen('similar')
    } catch (e) {
      setError(typeof e?.message === 'string' ? e.message : 'Upload failed')
    } finally {
      setAnalyzing(false)
      // reset file input so same file can trigger again
      e.target.value = ''
    }
  }

  const onAnalyzeFromUrl = async () => {
    if (!imageUrl) return
    setAnalyzing(true)
    setError('')
    try {
      const form = new FormData()
      form.append('image_url', imageUrl)
      const res = await fetch(`${BACKEND}/analyze`, { method: 'POST', body: form })
      if (!res.ok) throw new Error(await res.text())
      setScreen('similar')
    } catch (e) {
      setError(typeof e?.message === 'string' ? e.message : 'Search failed')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-30 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-2">
          <div className="text-[22px] md:text-[24px] font-bold">Vintage Finds</div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button onClick={() => setScreen('upload')} className={`px-3 py-2 rounded-full text-[14px] ${screen==='upload'?'bg-black text-white':'hover:bg-black/5'}`}>Add Photo</button>
            <button onClick={() => setScreen('market')} className={`px-3 py-2 rounded-full text-[14px] ${screen==='market'?'bg-black text-white':'hover:bg-black/5'}`}>Marketplace</button>
            <button onClick={() => setScreen('similar')} className={`px-3 py-2 rounded-full text-[14px] ${screen==='similar'?'bg-black text-white':'hover:bg-black/5'}`}>Similar Items</button>
          </div>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

      {screen === 'upload' && (
        <UploadScreen
          onChoose={onChoose}
          onTake={onTake}
          imageUrl={imageUrl}
          onImageUrlChange={setImageUrl}
          onAnalyzeFromUrl={onAnalyzeFromUrl}
          analyzing={analyzing}
          error={error}
        />
      )}
      {screen === 'market' && (
        <MarketplacePage />
      )}
      {screen === 'similar' && (
        <SimilarItemsPage />
      )}
    </div>
  )
}

export default App
