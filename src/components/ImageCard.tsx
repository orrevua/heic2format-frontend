import type { ConvertedImage } from "../services/converter";
import Spinner from "./Spinner";

interface ImageCardProps {
  image: ConvertedImage;
  index: number;
}

export default function ImageCard({ image, index }: ImageCardProps) {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = image.fileUrl;
    a.download = image.fileName;
    a.click();
  };

  return (
    <div
      className="bg-[var(--card-bg)] rounded-2xl border-[3px] border-[var(--border)] cartoon-shadow overflow-hidden w-[190px] flex flex-col cartoon-shadow-hover animate-bounce-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="h-[150px] flex items-center justify-center bg-[#FFF9F0] border-b-[3px] border-[var(--border)]">
        {image.status === "converting" && <Spinner />}
        {image.status === "done" && (
          <img
            src={image.fileUrl}
            alt={image.fileName}
            className="w-full h-full object-cover"
          />
        )}
        {image.status === "error" && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">:(</span>
            <span className="text-[var(--coral)] text-xs font-bold font-['Baloo_2']">Failed</span>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2">
        <span className="text-xs text-[var(--navy)] font-semibold truncate" title={image.fileName}>
          {image.fileName}
        </span>
        {image.status === "done" && (
          <button
            onClick={handleDownload}
            className="btn-cartoon bg-[var(--teal)] text-[var(--border)] text-xs !py-1.5 !px-3 !text-sm w-full"
          >
            Download
          </button>
        )}
        {image.status === "error" && (
          <span className="text-xs text-[var(--coral)] truncate font-medium" title={image.error}>
            {image.error}
          </span>
        )}
      </div>
    </div>
  );
}
