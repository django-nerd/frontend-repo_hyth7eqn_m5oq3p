export default function NavBar({ title, onBack, right }) {
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-3">
        <button aria-label="Back" onClick={onBack} className={`h-9 w-9 flex items-center justify-center rounded-full hover:bg-black/5 ${onBack ? '' : 'invisible'}`}>
          {/* back icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="text-[24px] font-bold text-black select-none flex-1">{title}</div>
        <div className="flex items-center gap-2">{right}</div>
      </div>
    </div>
  )
}
