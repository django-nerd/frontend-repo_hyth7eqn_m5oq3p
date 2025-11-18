export default function PillButton({ variant = 'black', icon, children, ...props }) {
  const base = 'w-full h-[70px] rounded-[20px] flex items-center justify-center gap-3 text-[16px] font-semibold transition shadow-sm';
  const styles = variant === 'black'
    ? 'bg-black text-white hover:bg-black/90'
    : 'bg-white text-black border border-[#E5E5E5] hover:bg-black/5';
  return (
    <button {...props} className={`${base} ${styles}`}>
      {icon}
      <span>{children}</span>
    </button>
  )
}
