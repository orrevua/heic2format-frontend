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
      className={`relative px-6 py-6 flex flex-col items-center gap-2 cursor-pointer w-full transition-all duration-200 ${
        dragOver ? "cartoon-dashed-active bg-[#EEF0FF] scale-[1.02]" : "cartoon-dashed hover:bg-[#FFFAF0]"
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
          <p className="font-['Baloo_2'] font-bold text-sm text-[var(--navy)] tracking-wide mb-1">
            {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} ready!
          </p>
          {selectedFiles.map((file, i) => (
            <span key={i} className="flex items-center gap-2 text-sm text-[var(--navy)] opacity-70 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--teal)] border border-[var(--border)] flex-shrink-0" />
              {file.name}
              <span className="text-xs opacity-50">({formatSize(file.size)})</span>
            </span>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-3">
          <div className="w-14 h-14 rounded-2xl bg-[var(--yellow)] border-[3px] border-[var(--border)] cartoon-shadow-sm flex items-center justify-center animate-float">
            <svg className="w-7 h-7 text-[var(--border)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-['Baloo_2'] font-semibold text-[var(--navy)] text-base">
            Drop HEIC files here
          </span>
          <span className="text-xs text-[var(--navy)] opacity-50">or click to browse</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 mt-1 bg-[#FFF0F0] border-2 border-[var(--coral)] rounded-xl px-3 py-1.5">
          <span className="text-base">!</span>
          <p className="text-xs text-[var(--coral)] font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
}
