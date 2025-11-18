import NavBar from './NavBar'
import SectionHeader from './SectionHeader'
import ProductCard from './ProductCard'

const sources = ['Auctionet', '1stDibs', 'Pamono']

const sample = Object.fromEntries(sources.map((s, i) => [s, Array.from({ length: 4 }).map((_, j) => ({
  title: `${s} item ${j+1} — Beautiful mid-century chair`,
  image: `https://picsum.photos/seed/${s}${j}/800/600`,
  price: j % 2 === 0 ? { currency: 'EUR', value: 1500 + j * 75 } : null
}))]))

export default function SimilarItemsPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <NavBar title="Similar Items" onBack={() => {}} />
      <div className="max-w-6xl mx-auto px-5 py-5">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <img src="https://images.unsplash.com/photo-1636380733248-70f41ebcb6d5?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxJZGVudGlmaWVkfGVufDB8MHx8fDE3NjM0NTcyMTF8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" alt="Identified" className="w-full rounded-[16px] shadow-sm border border-[#F2F2F2]" />
          <div>
            <div className="text-[28px] font-bold">Paimio Chair</div>
            <div className="text-[16px] text-[#6E6E6E] mt-1">Modernist</div>
            <div className="text-[16px] text-black mt-1">by Alvar Aalto</div>
            <div className="mt-4 bg-[#F4F8FF] rounded-[14px] p-4">
              <div className="text-[14px] text-[#6E6E6E]">Search query</div>
              <div className="text-[16px] font-medium text-black">"alvar aalto paimio chair"</div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SectionHeader>Results</SectionHeader>
          {sources.map((s) => (
            <div key={s} className="mt-6">
              <div className="text-[18px] font-semibold mb-3">{s}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {sample[s].map((it, idx) => (
                  <ProductCard key={idx} item={it} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
