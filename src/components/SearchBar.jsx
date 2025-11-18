export default function SearchBar({ defaultValue = '', onSubmit }) {
  const handle = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get('q')?.toString() ?? '';
    onSubmit?.(q);
  };
  return (
    <form onSubmit={handle} className="flex items-center gap-2 bg-white border border-[#E5E5E5] rounded-[14px] px-3 py-2">
      <button type="button" aria-label="Back" className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-black/5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <input name="q" defaultValue={defaultValue} placeholder='"chairs"' className="flex-1 outline-none text-[16px]" />
      <button className="px-3 py-1 rounded-full bg-black text-white text-[14px]">Search</button>
    </form>
  );
}
