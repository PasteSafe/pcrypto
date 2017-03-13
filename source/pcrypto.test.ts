
import * as tape from "tape"
import {encrypt, decrypt} from "./pcrypto"

tape("encrypt and decrypt text", async test => {
  test.plan(4)

  const text = "Italian Greyhound"
  const password = "doggo"

  const hexcode: string = await encrypt({text, password})

  test.ok(typeof hexcode === "string", "encrypt result is string")
  test.ok(hexcode.length, "encrypted string is not empty")
  test.ok(hexcode.indexOf(text) === -1, "encryted string doesn't contain original text")

  const decryptedText = await decrypt({hexcode, password})

  test.ok(decryptedText === text, "decryption result is correct")
})
