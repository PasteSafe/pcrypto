
// Simple text encryption and decryption in the browser.
//  - exports `encrypt` and `decrypt`
//  - built on the Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API

import {hex, unhex} from "./hexer"
import {EncryptOptions, DecryptOptions, PrepareKeyOptions, CryptionOptions} from "./pcrypto.interfaces"

/**
 * Browser's Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Crypto
 */
const crypto: Crypto = window.crypto || (<any>window).msCrypto

/**
 * Default values for all crypto options.
 */
const defaults: CryptionOptions = {
  password: undefined,
  text: undefined,
  hexcode: undefined,
  charset: "utf-8",
  algorithm: "aes-gcm",
  hashAlgorithm: "sha-256",
  ivSize: 128
}

/**
 * Convert a password string into a CryptoKey: https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey
 *  - used in both encryption and decryption
 */
async function prepareKey(options: PrepareKeyOptions): Promise<CryptoKey> {
  options = {...defaults, ...options}
  const {password, hashAlgorithm, charset, algorithm} = options
  const hash = await crypto.subtle.digest(hashAlgorithm, new TextEncoder(charset).encode(password))
  return crypto.subtle.importKey("raw", hash, algorithm, false, ["encrypt", "decrypt"])
}

/**
 * Encrypt text with a password.
 * Return an encrypted hex string.
 */
export async function encrypt(options: EncryptOptions): Promise<string> {
  options = {...defaults, ...options}
  const {text, charset, algorithm, ivSize} = options

  // Initialization Vector
  // The IV is random noise, which is used in every encryption to make it unique and unpredictable.
  //  - wiki: https://en.wikipedia.org/wiki/Initialization_vector
  const iv = new Uint8Array(ivSize)
  crypto.getRandomValues(iv)

  // Perform the encryption.
  const payload = new Uint8Array(await crypto.subtle.encrypt(

    // Parameters for the web crypto api.
    {name: algorithm, iv},

    // Prepare the password as a binary crypto key.
    await prepareKey(options),

    // The web cryptography api requires binary input, so we use TextEncoder to encode our string.
    // This is why internet explorer isn't supported.
    //  - mdn: https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/TextEncoder
    //  - whatwg: https://encoding.spec.whatwg.org/#dom-textencoder-encoding
    new TextEncoder(charset).encode(text)
  ))

  // Combining the IV and the encryption result into a single binary buffer.
  const binary = new ArrayBuffer(ivSize + payload.byteLength)
  new Uint8Array(binary, 0, ivSize).set(iv)
  new Uint8Array(binary, ivSize, payload.byteLength).set(payload)

  // Return the hexcode encrypted string.
  return hex(binary)
}

/**
 * Decrypt a hex string with a password.
 * Return the clear text payload.
 */
export async function decrypt(options: DecryptOptions): Promise<string> {
  options = {...defaults, ...options}
  const {hexcode, charset, algorithm, ivSize} = options

  const binary = unhex(hexcode)
  const payload = new Uint8Array(await crypto.subtle.decrypt(
    {name: algorithm, iv: new Uint8Array(binary, 0, ivSize)},
    await prepareKey(options),
    new Uint8Array(binary, ivSize, binary.byteLength - ivSize)
  ))

  // Return the decrypted text.
  return new TextDecoder(charset).decode(payload)
}
