export default function Footer() {
  return (
    <footer className="bg-[#dab16f] hidden h-20 sm:hidden md:flex justify-between items-center">
      <div className="px-8">
        <a href="https://github.com/orrevua/heic2format-frontend">
          &gt; feel free to contribute<span className="animate-pulse">_</span>
        </a>
      </div>
      <span className="px-8 flex gap-2">
        made by
        <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/flpfranca/" className="underline underline-offset-4">
          orrevua
        </a>
      </span>
    </footer>
  );
}
