export const baseUrlMedia = process.env.NEXT_PUBLIC_BASE_URL;

export const mediaUrl = (url: string) => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  const base = (
    baseUrlMedia ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3002"
  ).replace(/\/+$/, "");
  const path = url.replace(/\\/g, "/").replace(/^\/+/, "");
  return base ? `${base}/${path}` : `/${path}`;
};

