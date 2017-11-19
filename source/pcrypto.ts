
/*

pcrypto
=======

text encryption and decryption in the browser

 - exports async `encrypt` and `decrypt` functions

 - built on the Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API

*/

import {hex, unhex} from "./hextool"

export interface CommonCryptionOptions {

	/** Password string, which may contain any characters, but must not be an empty string ("") */
	password: string
}

export interface EncryptOptions extends CommonCryptionOptions {

	/** String of text to be encrypted */
	plaintext: string
}

export interface DecryptOptions extends CommonCryptionOptions {

	/** Encrypted text, which can only be decrypted with the use of the password */
	ciphertext: string
}

// browser web crypto api: https://developer.mozilla.org/en-US/docs/Web/API/Crypto
const crypto: Crypto = window.crypto || (<any>window).msCrypto
const cryptoSubtle: SubtleCrypto = crypto.subtle || (<any>window).crypto.webkitSubtle

// constants for pcrypto internal use
const constants = Object.freeze({
	algorithm: "aes-gcm",
	hashAlgorithm: "sha-256",
	charset: "utf-8",
	ivSize: 96
})

/**
 * Convert a password string into a CryptoKey: https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey
 *  - used in both encryption and decryption
 *  - not exported, private to pcrypto
 */
async function convertPasswordToCryptoKey({password}: CommonCryptionOptions): Promise<CryptoKey> {
	const hash = await cryptoSubtle.digest(constants.hashAlgorithm, new TextEncoder(constants.charset).encode(password))
	return cryptoSubtle.importKey("raw", hash, "aes-gcm", false, ["encrypt", "decrypt"])
}

/**
 * Encrypt text with a password
 *  - return an encrypted hex string
 */
export async function encrypt({password, plaintext}: EncryptOptions): Promise<string> {
	const {ivSize, algorithm} = constants

	// enforce required options
	if (!password) throw new Error("encrypt requires option 'password'")
	if (!plaintext) throw new Error("encrypt requires option 'plaintext'")

	// initialization vector
	//  - random noise
	//  - used in every encryption
	//  - makes the encryption unique and unpredictable
	//  - wiki: https://en.wikipedia.org/wiki/Initialization_vector
	const iv = new Uint8Array(ivSize)
	crypto.getRandomValues(iv)

	// perform the encryption, calling the web crypto api
	const payload = new Uint8Array(await cryptoSubtle.encrypt(

		// parameters for the web crypto api encryption
		{name: algorithm, iv},

		// crypto key based on the password
		await convertPasswordToCryptoKey({password}),

		// the web cryptography api requires binary input, so we use TextEncoder to encode our string into binary
		//  - some browsers don't have TextEncoder, and aren't supported by pcrypto
		//  - mdn: https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/TextEncoder
		//  - whatwg: https://encoding.spec.whatwg.org/#dom-textencoder-encoding
		new TextEncoder(constants.charset).encode(plaintext)
	))

	// combine the IV and the encrypted payload into a single binary buffer
	const binary = new ArrayBuffer(ivSize + payload.byteLength)
	new Uint8Array(binary, 0, ivSize).set(iv)
	new Uint8Array(binary, ivSize, payload.byteLength).set(payload)

	// return encrypted hexcode string
	return hex(binary)
}

/**
 * Decrypt a hex string with a password
 *  - return deciphered text
 */
export async function decrypt({password, ciphertext}: DecryptOptions): Promise<string> {
	const {algorithm, ivSize} = constants

	// enforce required options
	if (!password) throw new Error("decrypt requires option 'password'")
	if (!ciphertext) throw new Error("decrypt requires option 'ciphertext'")

	// unwind encrypted hexcode to encrypted binary
	const encryptedBinary = unhex(ciphertext)

	// perform decryption
	const decryptedBinary = new Uint8Array(await cryptoSubtle.decrypt(
		{name: algorithm, iv: new Uint8Array(encryptedBinary, 0, ivSize)},
		await convertPasswordToCryptoKey({password}),
		new Uint8Array(encryptedBinary, ivSize, encryptedBinary.byteLength - ivSize)
	))

	// return deciphered text (binary payload converted back into text)
	return new TextDecoder(constants.charset).decode(decryptedBinary)
}
