import { publicAsset } from '../data/content'

type Props = {
  path: string
  alt: string
  loading?: 'lazy' | 'eager'
  className?: string
}

/** Gallery screenshots from public/. Plain img avoids broken WebP when .webp files are not deployed yet. */
export function GalleryImage({ path, alt, loading = 'lazy', className }: Props) {
  return <img src={publicAsset(path)} alt={alt} loading={loading} decoding="async" className={className} />
}
