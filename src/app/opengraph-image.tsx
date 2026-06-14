import type { ImageResponse } from "next/og";
import { ogAlt, ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImage(): ImageResponse {
  return renderOgImage();
}
