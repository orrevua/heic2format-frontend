export default function Footer() {
  return (
    <footer className="relative z-10 border-t-[3px] border-[var(--border)] bg-[var(--navy)] text-white/80">
      <div className="flex flex-col sm:flex-row justify-between items-center px-8 md:px-20 py-4 gap-2">
        <a
          href="https://github.com/orrevua/heic2format-frontend"
          className="font-['Baloo_2'] font-semibold text-sm text-white/70 hover:text-white no-underline hover:no-underline transition-colors"
        >
          &gt; feel free to contribute<span className="animate-pulse">_</span>
        </a>
        <span className="text-sm flex gap-1.5 items-center text-white/50">
          made by
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/flpfranca/"
            className="font-['Baloo_2'] font-bold text-[var(--yellow)] no-underline hover:no-underline hover:text-white transition-colors"
          >
            orrevua
          </a>
        </span>
      </div>
    </footer>
  );
}
