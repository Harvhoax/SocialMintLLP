import manifest from './media-manifest.json';

// Generated offline: no image transformations or media functions at request time.
const assets: Record<string, string> = manifest.assets;
const previews: Record<string, {src: string; bytes: number; width: number; height: number; duration: number}> = manifest.previews;

export const assetUrl = (path: string) => assets[path] || path;
export const reelPoster = (slug: string) => assetUrl(`/reels/${slug}.jpg`);
export const reelPreview = (slug: string) => previews[slug].src;
