
import * as tape from "tape"
import {encrypt, decrypt} from "./pcrypto"

const constants = Object.freeze({
	password: "doggos",
	plaintext: "Italian Greyhounds — السلوقي الإيطالي",
	ciphertext:"229951905EE626C1C9F3789B3A0A337BEB58BFCE07239A4CCB615A6" +
		"32BB57AC8C3001A33E4EE840F798242817581133C926A5D321C0172AE543430C" +
		"6B595877A5A7237D1431532481B13A9A869C2F91A53E7A586A585B674AF69AFD" +
		"72F43E24F6C93FA287F6EF50C7E20F1014243D5D6C38629BA659FA35CD2E8220" +
		"6042BF0379615D38A6112C5E72FC036AA8A439D454B16B2FF49F4AB958B73499" +
		"5315C6F1A09A92B1C5705"
})

const opts = {timeout: 2*1000}
const skip = {...opts, skip: true}

//
// Tests for 'encrypt'
//

tape("encrypt: works as expected", opts, async test => {
	const {password, plaintext} = constants
	const ciphertext = await encrypt({password, plaintext})
	test.ok(ciphertext, "encrypted ciphertext is ok")
	test.ok(ciphertext.length, "encrypted ciphertext string is not empty")
	test.ok(ciphertext.indexOf(plaintext) === -1, "encryted ciphertext doesn't contain original text")
	test.end()
})

tape("encrypt: requires option 'password'", opts, async test => {
	const password = ""
	const {plaintext} = constants
	try {
		const actual = await encrypt({password, plaintext})
		test.fail("encrypt without option 'password' must throw")
		test.end()
	}
	catch (error) {
		test.ok(error && error instanceof Error, "encrypt fails properly without option 'password'")
		test.end()
	}
})

tape("encrypt: requires option 'plaintext'", opts, async test => {
	const {password} = constants
	const plaintext = ""
	try {
		const actual = await encrypt({password, plaintext})
		test.fail("encrypt without option 'plaintext' must throw")
		test.end()
	}
	catch (error) {
		test.ok(error && error instanceof Error, "encrypt fails properly without option 'plaintext'")
		test.end()
	}
})

//
// Tests for 'decrypt'
//

tape("decrypt: works as expected", opts, async test => {
	const {password, ciphertext} = constants
	const plaintext = await decrypt({password, ciphertext})
	test.ok(plaintext, "decrypted plaintext is ok")
	test.ok(plaintext.length, "decrypted string is not empty")
	test.ok(plaintext === constants.plaintext, "decrypted plaintext is correct")
	test.end()
})

tape("decrypt: incorrect password fails gracefully", opts, async test => {
	const {ciphertext} = constants
	const password = "incorrect"
	try {
		const plaintext = await decrypt({password, ciphertext})
		test.fail("decrypt should throw an error")
	}
	catch (error) {
		test.ok(error, "error is ok")
	}
	test.end()
})

tape("decrypt: requires option 'password'", opts, async test => {
	const password = ""
	const {ciphertext} = constants
	try {
		const actual = await decrypt({password, ciphertext})
		test.fail("decrypt without option 'password' must throw")
		test.end()
	}
	catch (error) {
		test.ok(error && error instanceof Error, "decrypt fails nicely without option 'password'")
		test.end()
	}
})

tape("decrypt: requires option 'ciphertext'", opts, async test => {
	const {password} = constants
	const ciphertext = ""
	try {
		const actual = await decrypt({password, ciphertext})
		test.fail("decrypt without option 'ciphertext' must throw")
		test.end()
	}
	catch (error) {
		test.ok(error && error instanceof Error, "decrypt fails nicely without option 'ciphertext'")
		test.end()
	}
})

//
// Integration tests
//

tape("encrypt and decrypt: work together as expected", opts, async test => {
	const {password, plaintext} = constants
	const ciphertext = await encrypt({password, plaintext})
	const newtext = await decrypt({password, ciphertext})
	test.ok(newtext === plaintext, "text passes through encrypt and decrypt")
	test.end()
})
