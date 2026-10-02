// Convierte una imagen elegida por el usuario en un avatar cuadrado y muy ligero
// (WebP de 160×160 en base64, ~6-12 KB) para guardarlo en Firestore sin necesidad de Storage.
// Si el navegador no sabe generar WebP (Safari antiguo), se usa JPEG.
const MAX = 20000 // caracteres de base64 ≈ 15 KB

export async function fileToAvatar(file, size = 160) {
  if (!file || !file.type.startsWith('image/')) throw new Error('El archivo no es una imagen.')
  if (file.size > 15 * 1024 * 1024) throw new Error('La imagen es demasiado grande (máximo 15 MB).')
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise((res, rej) => {
      const i = new Image()
      i.onload = () => res(i)
      i.onerror = () => rej(new Error('No se pudo leer la imagen. Prueba con JPG o PNG.'))
      i.src = url
    })
    const s = Math.min(img.naturalWidth, img.naturalHeight)
    const sx = (img.naturalWidth - s) / 2
    const sy = (img.naturalHeight - s) / 2
    const cv = document.createElement('canvas')
    cv.width = size; cv.height = size
    const ctx = cv.getContext('2d')
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, size, size) // fondo para imágenes con transparencia
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size)
    // Calidad decreciente hasta que pese menos de ~15 KB
    const webp = cv.toDataURL('image/webp', 0.8).startsWith('data:image/webp')
    const type = webp ? 'image/webp' : 'image/jpeg'
    let q = 0.8, out = cv.toDataURL(type, q)
    while (out.length > MAX && q > 0.35) { q -= 0.1; out = cv.toDataURL(type, q) }
    return out
  } finally {
    URL.revokeObjectURL(url)
  }
}
