
import * as tape from "tape"
import {encrypt, decrypt} from "./pcrypto"

const constants = Object.freeze({
  password: "doggos",
  plaintext: "Italian Greyhounds — السلوقي الإيطالي"
})

//
// Tests for 'encrypt'
//

tape("encrypt works as expected", {timeout: 2*1000}, async test => {
  const {password, plaintext} = constants
  const ciphertext = await encrypt({password, plaintext})
  test.ok(ciphertext, "encrypt didn't die")
  test.ok(ciphertext.length, "encrypted string is not empty")
  test.ok(ciphertext.indexOf(plaintext) === -1, "encryted string doesn't contain original text")
  test.end()
})

tape.skip("encrypt fails with empty password", async test => {
  const password = ""
  const {plaintext} = constants
  try {
    const actual = await encrypt({password, plaintext})
    test.fail("encrypt must throw given nulls")
    test.end()
  }
  catch (error) {
    test.ok(error, "failed encrypt throws")
    test.ok(error instanceof Error, "failed encrypt throws Error instance")
    test.end()
  }
})

tape.skip("encrypt fails with nulls", async test => {
  const password = null
  const plaintext = null
  try {
    const actual = await encrypt({password, plaintext})
    test.fail("encrypt must throw when given nulls")
    test.end()
  }
  catch (error) {
    test.ok(error, "encrypt fails nicely")
    test.ok(error instanceof Error, "encrypt fails and throws Error instance")
    test.end()
  }
})

//
// Integration tests
//

tape("encrypt and decrypt text", async test => {
  const {password, plaintext} = constants
  const ciphertext = await encrypt({password, plaintext})
  const newtext = await decrypt({password, ciphertext})
  test.ok(newtext === plaintext, "text passes through encrypt and decrypt")
  test.end()
})
