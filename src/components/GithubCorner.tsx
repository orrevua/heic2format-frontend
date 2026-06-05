import { ReactComponent as GhCornerIcon } from "/src/assets/gh-corner.svg";

export default function GithubCorner() {
  return (
    <a
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
      href="https://github.com/orrevua/heic2format-frontend"
      aria-label="View source on GitHub"
      className="top-0 right-0 xl:fixed absolute z-20 hover:scale-110"
    >
      <GhCornerIcon className="w-28 h-28" />
    </a>
  );
}
