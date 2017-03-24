
import * as tape from "tape"
import {encrypt, decrypt} from "./pcrypto"

const constants = Object.freeze({
  password: "doggos",
  plaintext: "Italian Greyhounds — السلوقي الإيطالي",
  ciphertext: "FD084D07F6745BE726A78D2D9691D94017A211CFB9694CE03B028A0"
    + "A29D8C820F48AFACF3775DFC53350156FF6C724368A3216072DD38EA703559E"
    + "16E2887C181892DC02F8BFFE2CF87DB7B1E8895B217DAAE61C586C2314A6A01"
    + "237E6AB95E09A8D333BC375EE69622359F0ECF176F71109B72FA36CD623299B"
    + "B3C99D411F969F2AF7021DA2183E148A75165DDBBCE0EA79A9E8A4157BE8AB5"
    + "985B15E4BB62FDACA8B9C9A199E3780E74081A83C69641F0F9597B9AA3C7F4A"
    + "41299C8F7C541D6DE17E9B2A59"
})

const opts = {timeout: 2*1000}

//
// Tests for 'encrypt'
//

tape("encrypt works as expected", {...opts}, async test => {
  const {password, plaintext} = constants
  const ciphertext = await encrypt({password, plaintext})
  test.ok(ciphertext, "encrypted ciphertext is ok")
  test.ok(ciphertext.length, "encrypted ciphertext string is not empty")
  test.ok(ciphertext.indexOf(plaintext) === -1, "encryted ciphertext doesn't contain original text")
  test.end()
})

tape("encrypt requires option 'password'", {...opts}, async test => {
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

tape("encrypt requires option 'plaintext'", {...opts}, async test => {
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

tape("decrypt works as expected", {...opts}, async test => {
  const {password, ciphertext} = constants
  const plaintext = await decrypt({password, ciphertext})
  test.ok(plaintext, "decrypted plaintext is ok")
  test.ok(plaintext.length, "decrypted string is not empty")
  test.ok(plaintext === constants.plaintext, "decrypted plaintext is correct")
  test.end()
})

tape("decrypt requires option 'password'", {...opts}, async test => {
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

tape("decrypt requires option 'ciphertext'", {...opts}, async test => {
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

tape("encrypt and decrypt work together as expected", {...opts}, async test => {
  const {password, plaintext} = constants
  const ciphertext = await encrypt({password, plaintext})
  const newtext = await decrypt({password, ciphertext})
  test.ok(newtext === plaintext, "text passes through encrypt and decrypt")
  test.end()
})
