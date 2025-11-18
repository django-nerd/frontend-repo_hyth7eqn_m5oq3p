import NavBar from './NavBar'
import PillButton from './PillButton'

export default function UploadScreen({ onChoose, onTake }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <NavBar title="Add Photo" onBack={() => {}} />
      <div className="max-w-md mx-auto px-5 pt-10 pb-16">
        <div className="h-12" />
        <div className="space-y-4">
          <PillButton variant="black" onClick={onTake} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>}>
            Take a Photo
          </PillButton>
          <PillButton variant="white" onClick={onChoose} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>}>
            Choose from Library
          </PillButton>
        </div>
        <p className="text-[14px] text-[#6E6E6E] mt-4">
          Take or select a photo of your vintage item to find similar pieces
        </p>
      </div>
    </div>
  )
}
