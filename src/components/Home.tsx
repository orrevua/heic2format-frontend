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
    <>
      <section className="w-full flex flex-col justify-start items-start py-10 sm:px-0 xl:px-20">
        <div className="flex flex-col px-14 md:px-32 w-fit">
          <span className="text-black font-bold text-[30px] sm:text-[30px] md:text-[70px] xl:text-[70px] leading-[1]">
            HEIC2Format
          </span>
          <span>Convert your images from .HEIC to .JPEG and .PNG</span>
        </div>

        <div className="flex flex-col gap-4 justify-center items-center px-8 sm:px-8 md:px-32 min-w-full md:min-w-[300px] py-16">
          <div className="bg-white rounded-lg min-h-fit w-[300px] sm:max-w-[300px] md:max-w-[416px] sm:w-[300px] md:w-[416px] shadow-2xl flex flex-col justify-center items-center">
            <FileInput
              selectedFiles={files}
              setSelectedFiles={setFiles}
              className="w-[256px] sm:w-[256px] md:w-[416px]"
            />
            <hr className="w-full" />
            <div className="w-full flex">
              <select
                className="px-4 py-2 outline-none border-none rounded-b-lg w-fit h-full text-center bg-white hover:bg-gray-100 cursor-pointer font-bold italic text-black"
                value={toFormat}
                onChange={(e) => setToFormat(e.target.value)}
                aria-label="Output format"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
              </select>
              <div className="w-full flex justify-end items-center px-6 text-sm text-gray-500 truncate">
                {files?.length
                  ? `${files.length} file${files.length > 1 ? "s" : ""} ready`
                  : ""}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-col md:flex-row gap-4">
            {converting ? (
              <div className="flex items-center gap-2">
                <Spinner />
                <span className="text-sm text-gray-600 italic">
                  Converting {results.filter((r) => r.status === "done").length}/{results.length}...
                </span>
              </div>
            ) : (
              <button
                onClick={handleConvert}
                disabled={!files?.length}
                className="bg-[#F49462] hover:bg-[#d97037] active:bg-[#F49462E6] disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-lg italic shadow-lg py-2 px-6 rounded-lg transition-colors"
              >
                Convert {files && files.length > 1 ? `${files.length} Images` : "Image"}
              </button>
            )}
            {doneCount > 1 && (
              <button
                onClick={handleDownloadAll}
                className="bg-[#172767] hover:bg-[#161E3EF2] active:bg-[#223a9a] text-white text-lg italic shadow-lg py-2 px-6 rounded-lg transition-colors"
              >
                Download All ({doneCount})
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="w-full bg-white min-h-[100px] sm:min-h-[100px] md:min-h-[300px] flex flex-col px-14 sm:px-14 md:px-32 mt-auto sm:mt-auto py-8">
        {results.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-800">
                  Converted Images
                </h2>
                {errorCount > 0 && (
                  <span className="text-xs text-red-500">
                    {errorCount} failed
                  </span>
                )}
              </div>
              <button
                onClick={handleClear}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {results.map((img) => (
                <ImageCard key={img.id} image={img} />
              ))}
            </div>
          </>
        ) : (
          <span className="w-full text-center sm:text-center md:text-left md:px-0 xl:px-20 text-[1rem] md:text-xl text-gray-400 font-bold self-center">
            No images converted yet
          </span>
        )}
      </section>
    </>
  );
}
