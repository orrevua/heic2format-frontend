import type { ConvertedImage } from "../services/converter";
import Spinner from "./Spinner";

interface ImageCardProps {
  image: ConvertedImage;
}

export default function ImageCard({ image }: ImageCardProps) {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = image.fileUrl;
    a.download = image.fileName;
    a.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-[180px] flex flex-col">
      <div className="h-[140px] flex items-center justify-center bg-gray-50">
        {image.status === "converting" && <Spinner />}
        {image.status === "done" && (
          <img
            src={image.fileUrl}
            alt={image.fileName}
            className="w-full h-full object-cover"
          />
        )}
        {image.status === "error" && (
          <span className="text-red-400 text-xs text-center px-2">Failed</span>
        )}
      </div>
      <div className="p-2 flex flex-col gap-1">
        <span className="text-xs text-gray-600 truncate" title={image.fileName}>
          {image.fileName}
        </span>
        {image.status === "done" && (
          <button
            onClick={handleDownload}
            className="bg-[#172767] hover:bg-[#161E3EF2] text-white text-xs py-1 px-2 rounded transition-colors"
          >
            Download
          </button>
        )}
        {image.status === "error" && (
          <span className="text-xs text-red-500 truncate" title={image.error}>
            {image.error}
          </span>
        )}
      </div>
    </div>
  );
}
