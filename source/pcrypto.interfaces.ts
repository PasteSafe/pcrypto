
/**
 * Cryption options that are common to encryption, decryption, and key preparation.
 */
export interface CommonCryptionOptions {
  password: string
  charset?: string
  algorithm?: string
  ivSize?: number
}

/**
 * Options for preparing a text password as a key.
 */
export interface PrepareKeyOptions extends CommonCryptionOptions {
  hashAlgorithm?: string
}

/**
 * Options for encrypting text.
 */
export interface EncryptOptions extends PrepareKeyOptions {
  text: string
}

/**
 * Options for decrypting text.
 */
export interface DecryptOptions extends PrepareKeyOptions {
  hexcode: string
}

/**
 * Combination of all cryption option types.
 */
export type CryptionOptions = CommonCryptionOptions & EncryptOptions & DecryptOptions & PrepareKeyOptions
