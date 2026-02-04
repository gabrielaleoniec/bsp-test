"use client";

import { useState } from "react";

import Image, { ImageProps } from "next/image";

/** Hostnames allowed in next.config.ts images.remotePatterns – use Next Image only for these. */
const ALLOWED_IMAGE_HOSTS = ["localhost", "picsum.photos"];

function isAllowedImageUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return ALLOWED_IMAGE_HOSTS.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`),
    );
  } catch {
    return false;
  }
}

export function SafeProductImage({
  src,
  alt,
  width = 400,
  height = 300,
  className,
  ...props
}: ImageProps) {
  const [nativeError, setNativeError] = useState(false);

  const hasValidUrl = typeof src === "string" && src.length > 0;
  const useNextImage = hasValidUrl && isAllowedImageUrl(src) && !nativeError;

  if (!hasValidUrl || nativeError) {
    return (
      <div
        className={className}
        style={{ width, height }}
        aria-label={alt}
        role="img"
      >
        <div className="flex h-full w-full items-center justify-center rounded border border-zinc-300 bg-zinc-100 text-sm text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          No image
        </div>
      </div>
    );
  }

  if (useNextImage) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        {...props}
      />
    );
  }

  // URL not in remotePatterns (e.g. broken or unknown domain) – use native img with fallback
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setNativeError(true)}
    />
  );
}
