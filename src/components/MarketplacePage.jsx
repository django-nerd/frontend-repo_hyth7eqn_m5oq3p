import NavBar from './NavBar'
import SearchBar from './SearchBar'
import SectionHeader from './SectionHeader'
import ProductCard from './ProductCard'

const sampleItems = Array.from({ length: 8 }).map((_, i) => ({
  title: `Auction item ${i+1} with a reasonably long name to test truncation`,
  image: `https://picsum.photos/seed/auction${i}/600/400`,
  price: { currency: 'EUR', value: 1200 + i * 50 },
  countdown: 'Ends in 2d 4h'
}))

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <NavBar title="Ongoing Auctions (24)" onBack={() => {}} />
      <div className="max-w-6xl mx-auto px-5 py-4">
        <SearchBar defaultValue='"chairs"' />

        <div className="mt-4 flex items-center justify-between text-[14px] text-[#6E6E6E]">
          <div>Filters</div>
          <div>Sort by</div>
        </div>

        <div className="mt-4 flex gap-6 border-b border-[#E5E5E5]">
          <button className="py-3 border-b-2 border-black font-semibold">Ongoing Auctions (24)</button>
          <button className="py-3 text-[#6E6E6E]">Sold items</button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sampleItems.map((it, idx) => (
            <ProductCard key={idx} item={it} />
          ))}
        </div>
      </div>
    </div>
  )
}
