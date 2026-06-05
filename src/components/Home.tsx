import { useRef, useState } from "react";
import FileInput from "./FileInput";
import Spinner from "./Spinner";
import ImageCard from "./ImageCard";
import { convertFiles, type ConvertedImage } from "../services/converter";

export default function Home() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const [converting, setConverting] = useState(false);
  const [toFormat, setToFormat] = useState("jpeg");
  const urlsRef = useRef<string[]>([]);

  async function handleConvert() {
    if (!files?.length) return;

    setConverting(true);

    const images = await convertFiles(files, toFormat, (progress) => {
      setResults(progress);
    });

    const newUrls = images.filter((img) => img.status === "done").map((img) => img.fileUrl);
    urlsRef.current.push(...newUrls);

    setFiles(null);
    setConverting(false);
  }

  function handleDownloadAll() {
    const doneImages = results.filter((img) => img.status === "done");
    doneImages.forEach((img, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = img.fileUrl;
        a.download = img.fileName;
        a.click();
      }, i * 200);
    });
  }

  function handleClear() {
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current = [];
    setResults([]);
    setFiles(null);
  }

  const doneCount = results.filter((r) => r.status === "done").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return (
    <div className="flex-1 flex flex-col relative z-10">
      {/* Hero + Converter */}
      <section className="w-full flex flex-col items-center py-8 md:py-14 px-6">
        {/* Title */}
        <div className="text-center mb-10 md:mb-14">
          <h1 className="font-['Baloo_2'] font-extrabold text-[2.5rem] sm:text-[3.2rem] md:text-[4.5rem] leading-[1] text-[var(--navy)] tracking-tight mb-3">
            HEIC
            <span className="relative inline-block mx-1">
              <span className="relative z-10">2</span>
              <span className="absolute inset-0 bg-[var(--yellow)] border-[3px] border-[var(--border)] rounded-xl -rotate-3 scale-[1.3]" />
            </span>
            Format
          </h1>
          <p className="text-[var(--navy)] opacity-60 font-semibold text-base md:text-lg mt-2">
            Convert your iPhone photos from .HEIC to .JPEG and .PNG
          </p>
        </div>

        {/* Converter Card */}
        <div className="w-full max-w-md">
          <div className="bg-[var(--card-bg)] rounded-3xl border-[3px] border-[var(--border)] cartoon-shadow p-5 flex flex-col gap-4">
            <FileInput selectedFiles={files} setSelectedFiles={setFiles} />

            {/* Format selector */}
            <div className="flex items-center gap-3">
              <div className="flex bg-[var(--cream)] rounded-xl border-[2.5px] border-[var(--border)] overflow-hidden">
                {["jpeg", "png"].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setToFormat(fmt)}
                    className={`px-5 py-2 font-['Baloo_2'] font-bold text-sm uppercase tracking-wider transition-colors ${
                      toFormat === fmt
                        ? "bg-[var(--indigo)] text-white"
                        : "text-[var(--navy)] hover:bg-[#F0EDFF]"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
              <span className="text-xs text-[var(--navy)] opacity-40 font-medium truncate flex-1 text-right">
                {files?.length
                  ? `${files.length} file${files.length > 1 ? "s" : ""} ready`
                  : ""}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {converting ? (
                <div className="flex items-center justify-center gap-3 w-full py-2">
                  <Spinner />
                  <span className="font-['Baloo_2'] font-semibold text-[var(--navy)] text-sm">
                    Converting {results.filter((r) => r.status === "done").length}/{results.length}...
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleConvert}
                  disabled={!files?.length}
                  className="btn-cartoon bg-[var(--tangerine)] text-white flex-1"
                >
                  {files && files.length > 1 ? `Convert ${files.length} Images` : "Convert Image"}
                </button>
              )}
              {doneCount > 1 && !converting && (
                <button
                  onClick={handleDownloadAll}
                  className="btn-cartoon bg-[var(--navy)] text-white flex-1"
                >
                  Download All ({doneCount})
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Gallery — only shown when there are results */}
      {results.length > 0 && (
        <section className="w-full px-6 md:px-16 xl:px-32 py-8 md:py-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border-[3px] border-[var(--border)] cartoon-shadow p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="font-['Baloo_2'] font-bold text-xl text-[var(--navy)]">
                  Converted Images
                </h2>
                {errorCount > 0 && (
                  <span className="bg-[var(--coral)] text-white text-xs font-bold px-2.5 py-0.5 rounded-full border-2 border-[var(--border)]">
                    {errorCount} failed
                  </span>
                )}
              </div>
              <button
                onClick={handleClear}
                className="font-['Baloo_2'] text-sm font-semibold text-[var(--navy)] opacity-40 hover:opacity-70 transition-opacity"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
              {results.map((img, i) => (
                <ImageCard key={img.id} image={img} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
