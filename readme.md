
pcrypto — simple in-browser text encryption
===========================================

- just two async functions, `encrypt` and `decrypt`, which operate on text strings
- in-browser only *(leverages the web crypto api)*
- npm module, umd format, es5
- written in typescript
- aes-gcm encryption with a 128 byte IV prefix

***pre-release warning:*** *pcrypto is in development and is not recommended for production use. the encrypt/decrpyt implementations may be subject to change between releases. ciphertext encrypted in one version of pcrypto may not be decryptable in another version*

***issues and pull requests wanted:*** *please help improve pcrypto by reviewing its code and contributing by opening issues or pull requests :)*


--------


install pcrypto into your javascript web app
--------------------------------------------

1. install pcrypto into your npm project

	`npm install --save pcrypto`

2. import pcrypto into your modern typescript or es6 code

	```typescript
	import {encrypt, decrypt} from "pcrypto"
	```

3. use browserify on your code so that node_modules like pcrypto are included in your bundle

	*(or use requirejs and set up some path mappings to include your node_modules)*


example usage: `en`cryption
---------------------------

```typescript
import {encrypt} from "pcrypto"

const password = "doggos"
const plaintext = "Italian Greyhounds — السلوقي الإيطالي"

encrypt({password, plaintext})
	.then(ciphertext => console.log(`ciphertext: ${ciphertext}`))

		//» "FD084D07..."
```


example usage: `de`cryption
---------------------------

```typescript
import {decrypt} from "pcrypto"

const password = "doggos",
const ciphertext = "FD084D07F6745BE726A78D2D9691D94017A211CFB9694CE03B0"
	+ "28A0A29D8C820F48AFACF3775DFC53350156FF6C724368A3216072DD38EA703559"
	+ "E16E2887C181892DC02F8BFFE2CF87DB7B1E8895B217DAAE61C586C2314A6A0123"
	+ "7E6AB95E09A8D333BC375EE69622359F0ECF176F71109B72FA36CD623299BB3C99"
	+ "D411F969F2AF7021DA2183E148A75165DDBBCE0EA79A9E8A4157BE8AB5985B15E4"
	+ "BB62FDACA8B9C9A199E3780E74081A83C69641F0F9597B9AA3C7F4A41299C8F7C5"
	+ "41D6DE17E9B2A59"

decrypt({password, ciphertext})
	.then(plaintext => console.log(`plaintext: ${plaintext}`))

		//» "Italian Greyhounds — السلوقي الإيطالي"
```


--------


alternatively, install pcrypto the old-fashioned way
----------------------------------------------------

- use npm to install `pcrypto` somewhere
- grab `node_modules/pcrypto/build/pcrypto.global.bundle.js` and put it by your HTML file

- put a script tag in your HTML:

	```html
	<script src="pcrypto.global.bundle.js"></script>
	```

- use pcrypto as you will

	```html
	<script>
		pcrypto.encrypt({password: "doggos", plaintext: "Italian Greyhounds"})
			.then(ciphertext => console.log(`ciphertext: ${ciphertext}`))
	</script>
	```


future considerations
---------------------

in the future, pcrypto might be extended or refactored to include the ability to encrypt/decrpyt files and binary blobs.
