// Read a WebP width and height from the VP8, VP8L, or VP8X header.
import { readFileSync } from 'node:fs'

export function webpSize(file) {
  const size = readWebp(readFileSync(file))
  if (!size) throw new Error(`No WebP dimension chunk in ${file}`)
  return size
}

export function readWebp(buf) {
  if (buf.length < 16 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') {
    return null
  }
  let offset = 12
  while (offset + 8 <= buf.length) {
    const tag = buf.toString('ascii', offset, offset + 4)
    const size = buf.readUInt32LE(offset + 4)
    const data = offset + 8
    if (tag === 'VP8X' && data + 10 <= buf.length) {
      return {
        width: 1 + (buf[data + 4] | (buf[data + 5] << 8) | (buf[data + 6] << 16)),
        height: 1 + (buf[data + 7] | (buf[data + 8] << 8) | (buf[data + 9] << 16)),
      }
    }
    if (tag === 'VP8 ' && data + 10 <= buf.length && buf[data + 3] === 0x9d && buf[data + 4] === 0x01 && buf[data + 5] === 0x2a) {
      return {
        width: buf.readUInt16LE(data + 6) & 0x3fff,
        height: buf.readUInt16LE(data + 8) & 0x3fff,
      }
    }
    if (tag === 'VP8L' && data + 5 <= buf.length && buf[data] === 0x2f) {
      const b0 = buf[data + 1]
      const b1 = buf[data + 2]
      const b2 = buf[data + 3]
      const b3 = buf[data + 4]
      return {
        width: 1 + (((b1 & 0x3f) << 8) | b0),
        height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
      }
    }
    offset += 8 + size + (size & 1)
  }
  return null
}
