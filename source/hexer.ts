
/**
 * Convert a binary buffer into a hex string.
 */
export function hex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(byte => ('00' + byte.toString(16).toUpperCase()).slice(-2))
    .join('');
}

/**
 * Convert a hex string into a binary buffer.
 */
export function unhex(hex: string): ArrayBuffer {
  const bufferLength = hex.length / 2;
  const buffer = new ArrayBuffer(bufferLength);
  const view = new Uint8Array(buffer);
  for (let bufferIndex=0; bufferIndex<bufferLength; bufferIndex++) {
    const hexIndex = bufferIndex * 2;
    const hexByte = hex[hexIndex] + hex[hexIndex+1];
    view[bufferIndex] = parseInt(hexByte, 16);
  }
  return buffer;
}
