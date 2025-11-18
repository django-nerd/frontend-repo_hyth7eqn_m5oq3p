export default function ProductCard({ item, onHeart }) {
  const priceText = item?.price?.value != null || item?.price?.currency
    ? [item.price.currency, new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(item.price.value || 0)].filter(Boolean).join(' ')
    : null
  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-[#F2F2F2] overflow-hidden">
      {item.image && (
        <div className="relative">
          <img src={item.image} alt={item.title} className="w-full aspect-[4/3] object-cover" />
          <button aria-label="Save" onClick={onHeart} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
          </button>
        </div>
      )}
      <div className="p-4">
        <div className="text-[16px] font-medium text-black line-clamp-2 min-h-[44px]">{item.title}</div>
        {item.countdown && <div className="text-[14px] text-[#6E6E6E] mt-1">{item.countdown}</div>}
        {priceText && <div className="text-[16px] font-bold text-black mt-2">{priceText}</div>}
      </div>
    </div>
  )
}
