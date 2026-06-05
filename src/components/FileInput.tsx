import { Dispatch, useRef, useState, DragEvent } from "react";

interface FileInputProps {
  selectedFiles: File[] | null;
  setSelectedFiles: Dispatch<File[]>;
  className?: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileInput({ selectedFiles, setSelectedFiles, className }: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => fileInputRef.current?.click();

  const validateAndSet = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const heicFiles = fileArray.filter(
      (f) => f.name.toLowerCase().endsWith(".heic") || f.name.toLowerCase().endsWith(".heif")
    );

    if (heicFiles.length === 0) {
      setError("Please select HEIC or HEIF files.");
      return;
    }

    const oversized = heicFiles.find((f) => f.size > MAX_FILE_SIZE);
    if (oversized) {
      setError(`"${oversized.name}" exceeds 50MB limit.`);
      return;
    }

    setError(null);
    setSelectedFiles(heicFiles);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) validateAndSet(e.currentTarget.files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) validateAndSet(e.dataTransfer.files);
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e: DragEvent) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={(e: DragEvent) => { e.preventDefault(); setDragOver(false); }}
      role="button"
      tabIndex={0}
      aria-label="Select HEIC files to convert"
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={`relative px-6 py-5 flex flex-col items-center gap-2 bg-white text-black rounded-lg cursor-pointer w-full transition-colors ${
        dragOver ? "bg-blue-50 border-2 border-dashed border-blue-400" : "hover:bg-[#7A92FC1A]"
      } ${className ?? ""}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleChange}
        accept=".heic,.heif"
        multiple
      />

      {selectedFiles?.length ? (
        <div className="w-full overflow-hidden">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
          </p>
          {selectedFiles.map((file, i) => (
            <span key={i} className="block text-sm text-gray-600 italic whitespace-nowrap overflow-hidden text-ellipsis">
              {file.name} <span className="text-gray-400">({formatSize(file.size)})</span>
            </span>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1 py-2">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span className="text-sm text-gray-600">Drop HEIC files here or click to browse</span>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
