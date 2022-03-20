well-known-regex
================

Get deeper type hints from validators using regex.

There are many libraries of regex functions for the purpose of validation, and while this library **does** serve this purpose, it's real purpose is one of recognition: It can classify a given field set and even generate coherent values for them.

All field values follow the structure of [faker](https://www.npmjs.com/package/@faker-js/faker) (currently implemented: `name.*`, `address.*`, `internet.*`)

Usage

```javascript
const { WKR, classifyRegex, generateData } = require('well-known-regex');
let classified = classify({
    properties : {
        name : { pattern: WKR.internet.username.pattern },
        email : { pattern: WKR.internet.email.pattern }
    }
}, {locale: 'en_us'});

/*
classified => {
    name : 'user.username',
    email : 'user.email'
}
*/

let generated = generateData({
    properties : {
        name : { pattern: WKR.internet.username.pattern },
        email : { pattern: WKR.internet.email.pattern }
    }
}, {locale: 'en_us', seed: 'some_value'});

```
