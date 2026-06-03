type PaletteCardProps = {
  colors: string[];
};

export function PaletteCard({ colors }: PaletteCardProps) {
  return (
    <article className="rounded-[30px] border border-[#ead8cd] bg-white p-5 shadow-[0_16px_48px_rgba(94,48,33,0.06)]">
      <h3 className="text-lg font-semibold text-[#2b1d18]">建议配色方向</h3>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {colors.map((color) => (
          <div key={color} className="space-y-2">
            <div
              className="h-20 rounded-[20px] border border-black/5"
              style={{ backgroundColor: color }}
            />
            <p className="text-center text-xs font-medium text-[#7b6257]">
              {color}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
