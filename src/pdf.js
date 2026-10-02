/*
  PDF de una sola página (A4 horizontal) con una imagen JPEG a página completa.
  Se genera en el navegador sin librerías y se descarga directamente: sin diálogo de impresión
  ni páginas en blanco.
*/
const enc = new TextEncoder()

export function jpegToPdf(jpeg, imgW, imgH, title = 'Certificado') {
  const PW = 841.89, PH = 595.28 // A4 horizontal en puntos
  const parts = []
  const offsets = []
  let size = 0
  const push = (chunk) => { const b = typeof chunk === 'string' ? enc.encode(chunk) : chunk; parts.push(b); size += b.length }
  const obj = (n, body) => { offsets[n] = size; push(`${n} 0 obj\n`); body(); push('\nendobj\n') }

  const content = `q ${PW} 0 0 ${PH} 0 0 cm /Im0 Do Q`
  const safeTitle = title.normalize('NFD').replace(/[^\x20-\x7e]/g, '').replace(/[()\\]/g, '')

  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')
  obj(1, () => push('<< /Type /Catalog /Pages 2 0 R >>'))
  obj(2, () => push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'))
  obj(3, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`))
  obj(4, () => {
    push(`<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`)
    push(jpeg); push('\nendstream')
  })
  obj(5, () => push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`))
  obj(6, () => push(`<< /Title (${safeTitle}) /Producer (EmilioMartelFx) >>`))

  const xref = size
  let x = 'xref\n0 7\n0000000000 65535 f \n'
  for (let i = 1; i <= 6; i++) x += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  push(x)
  push(`trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF`)
  return new Blob(parts, { type: 'application/pdf' })
}

// Canvas → PDF (el certificado ya tiene proporción A4)
export async function canvasToPdf(canvas, title) {
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.95))
  const bytes = new Uint8Array(await blob.arrayBuffer())
  return jpegToPdf(bytes, canvas.width, canvas.height, title)
}
