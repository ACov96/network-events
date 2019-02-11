/**
 * Kudos to these people for a good example:
 *  https://codeforgeek.com/2018/10/encrypt-and-decrypt-data-in-node-js/
 */
const crypto = require('crypto');

module.exports = {
  /**
   * Encrypt Message
   * @description Encrypts a message using the key and a randomly generated
   *              initialization vector. Constructs a packet with the
   *              unencrypted initialization vector followed by the encrypted
   *              packet.
   * @function
   * @param {String} text - Message to encrypt.
   * @param {Buffer} key - Secret key to use. Must have length of 32.
   * @returns {Buffer} Returns a buffer with the initialization vector as the
   *                   first 16 bytes followed by the encrypted message.
   */
  encrypt: (text, key) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let crypted = cipher.update(text);
    crypted = Buffer.concat([crypted, cipher.final()]);
    return Buffer.concat([iv, Buffer.from(crypted)]);
  },

  /**
   * Decrypt Message
   * @description Decrypts the message using the key and initialization
   *              vector provided.
   * @function
   * @param {Buffer} text - Message to decrypt.
   * @param {Buffer} key - Secret key to use. Must have length of 32.
   * @param {Buffer} iv - Initialization vector to use.
   * @returns {String} Returns decrypted message.
   */
  decrypt: (text, key, iv) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', (key), iv);
    let dec = decipher.update(text);
    dec = Buffer.concat([dec, decipher.final()]);
    return dec.toString();
  },
};
