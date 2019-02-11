/**
 * Kudos to these people for a good example:
 *  https://codeforgeek.com/2018/10/encrypt-and-decrypt-data-in-node-js/
 */
const crypto = require('crypto');

module.exports = {
  encrypt: (text, key) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let crypted = cipher.update(text);
    crypted = Buffer.concat([crypted, cipher.final()]);
    return Buffer.concat([iv, Buffer.from(crypted)]);
  },
  decrypt: (text, key, iv) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', (key), iv);
    let dec = decipher.update(text);
    dec = Buffer.concat([dec, decipher.final()]);
    return dec.toString();
  },
};
