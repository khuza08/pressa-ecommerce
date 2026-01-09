export function resolveImageUrl(image?: string | null) {
  if (!image) return null;

  if (image.startsWith('http')) return image;

  let filename = image;
  if (image.includes('uploads/')) {
    filename = image.split('uploads/').pop()!;
  }

  let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

  if (baseUrl.endsWith('/api/v1')) {
    baseUrl = baseUrl.replace('/api/v1', '');
  }

  // Ensure baseUrl doesn't end with a slash to avoid double slashes
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  return `${baseUrl}/uploads/${filename}`;
}