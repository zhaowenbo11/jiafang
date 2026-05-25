type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9f6e5a]">
        {eyebrow}
      </p>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-[#2b1d18]">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-[#70574c]">
          {description}
        </p>
      </div>
    </div>
  );
}
