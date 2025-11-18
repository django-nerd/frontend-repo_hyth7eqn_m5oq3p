import UploadAndSearch from './components/UploadAndSearch'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />

      <div className="relative min-h-screen flex items-start justify-center p-8">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-4">
              <img src="/flame-icon.svg" alt="Flames" className="w-14 h-14 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Vintage Finds</h1>
            <p className="text-lg text-blue-200">Identify designer pieces and find live listings across Auctionet, 1stDibs, and Pamono.</p>
          </div>

          <UploadAndSearch />

          <div className="text-center mt-14">
            <p className="text-sm text-blue-300/60">Two-stage AI identification using Google Vision and GPT-4o Vision</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
