
/**
 * Options common to both encryption and decryption
 */
export interface CommonCryptionOptions {

	/** Password string, which may contain any characters, but must not be an empty string ("") */
	password: string

	/** TextEncoder charset of the plaintext */
	charset?: string
}

/**
 * Options for encrypting text
 */
export interface EncryptOptions extends CommonCryptionOptions {

	/** String of text to be encrypted */
	plaintext: string
}

/**
 * Options for decrypting text
 */
export interface DecryptOptions extends CommonCryptionOptions {

	/** Encrypted text, which can only be decrypted with the use of the password */
	ciphertext: string
}
