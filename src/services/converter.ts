import heic2any from "heic2any";

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

async function convertViaAPI(file: File, format: string): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("format", format);

  const response = await fetch(`${API_URL}/convert`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Server error: ${response.status}`);
  }

  return response.blob();
}

async function convertClientSide(file: File, format: string): Promise<Blob> {
  const result = await heic2any({ blob: file, toType: `image/${format}` });
  return Array.isArray(result) ? result[0] : result;
}

export async function convertImage(file: File, format: string): Promise<Blob> {
  if (API_URL) {
    try {
      return await convertViaAPI(file, format);
    } catch (err) {
      console.warn("API conversion failed, falling back to client-side:", err);
      return await convertClientSide(file, format);
    }
  }
  return await convertClientSide(file, format);
}

export interface ConvertedImage {
  id: string;
  originalName: string;
  fileName: string;
  fileUrl: string;
  status: "converting" | "done" | "error";
  error?: string;
}

export async function convertFiles(
  files: File[],
  format: string,
  onProgress: (images: ConvertedImage[]) => void
): Promise<ConvertedImage[]> {
  const results: ConvertedImage[] = files.map((f) => ({
    id: crypto.randomUUID(),
    originalName: f.name,
    fileName: f.name.replace(/\.hei[cf]$/i, `.${format}`),
    fileUrl: "",
    status: "converting",
  }));

  onProgress([...results]);

  for (let i = 0; i < files.length; i++) {
    try {
      const blob = await convertImage(files[i], format);
      const url = URL.createObjectURL(blob);
      results[i] = { ...results[i], fileUrl: url, status: "done" };
    } catch (err) {
      results[i] = {
        ...results[i],
        status: "error",
        error: err instanceof Error ? err.message : "Conversion failed",
      };
    }
    onProgress([...results]);
  }

  return results;
}
