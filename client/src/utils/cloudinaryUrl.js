export function cloudinaryUrl(url, options = {}) {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  const {
    width = 800,
    quality = 'auto',
    format = 'auto',
  } = options;

  return url.replace(
    '/upload/',
    `/upload/f_${format},q_${quality},w_${width},c_limit/`
  );
}
