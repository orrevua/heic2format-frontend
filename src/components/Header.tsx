export default function Header() {
  return (
    <nav className="w-full flex">
      <ul className="w-full flex justify-between items-center px-12 sm:px-12 md:px-32 xl:px-48 h-32 bg-[#FEDEA9]">
        <li className="overflow-hidden shadow-lg w-[50px] sm:w-[50px] md:w-[50px] hover:scale-110">
          <img src="/logo-md.png" alt="HEIC2Format logo" width={100} height={50} />
        </li>
        <li>
          <a
            href="https://github.com/orrevua/heic2format-frontend"
            target="_blank"
            rel="noreferrer"
            className="text-white text-lg italic bg-[#4267E3] hover:bg-[#3556c7] active:bg-[#2545ae] shadow-lg py-2 px-6 rounded-lg inline-block"
          >
            GitHub
          </a>
        </li>
      </ul>
    </nav>
  );
}
