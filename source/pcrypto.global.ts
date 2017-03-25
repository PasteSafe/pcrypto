
//
// This file merely attaches pcrypto to the browser's global namespace (onto the window).
// Browserify is used to turn this into a bundle which can be easily included on an HTML page with a script tag.
//

import * as pcrypto from "./pcrypto"

window["pcrypto"] = pcrypto
