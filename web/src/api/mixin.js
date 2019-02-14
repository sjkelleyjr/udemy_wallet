import uuid from 'uuid/v4';
import LittleEndian from "int64-buffer";
import forge from 'node-forge';
import moment from 'moment';
import crypto from 'crypto';

function Mixin(api) {
  this.api = api;
}

Mixin.prototype = {

  createUser: function (callback, privateKey, publicKey, pin) {
    const self = this;

    publicKey = this.strip(publicKey);

    let params = {
        session_secret : publicKey,
        full_name : uuid().toLowerCase()
    };

    self.api.request('POST', '/users', params, function(resp) {
      if (resp.error) {
        return callback(resp);
      }
      self.api.account.cacheUser(resp.data, privateKey);

      self.updatePIN(function(resp) {
        return callback(resp);
      }, '', self.encryptedPin(pin));
    });
  },

  updatePIN: function (callback, old_pin, pin) {
    let params = {
      old_pin : old_pin,
      pin : pin
    };
    this.api.request('POST', '/pin/update', params, function(resp) {
      return callback(resp);
    });
  },

  encryptedPin: function (pin, pinToken, sessionId, privateKey, iterator) {
    if (!pinToken) {
      pinToken = this.api.account.pinToken();
    }
    if (!sessionId) {
      sessionId = this.api.account.sessionId();
    }
    if (!privateKey) {
      privateKey = this.api.account.privateKey();
    }
    if (iterator == undefined || iterator === "") {
      iterator = Date.now() * 1000000;
    }
    const blockSize = 16;
    let Uint64LE = LittleEndian.Int64BE;
    pinToken = new Buffer(pinToken, 'base64');
    privateKey = forge.pki.privateKeyFromPem(privateKey);
    //the pinToken sent back by mixin is decryptable by our private key
    let pinKey = privateKey.decrypt(pinToken, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      label: sessionId
    });
    let time = new Uint64LE(moment.utc().unix());
    time = [...time.toBuffer()].reverse();
    iterator = new Uint64LE(iterator);
    iterator = [...iterator.toBuffer()].reverse();
    pin = Buffer.from(pin, 'utf8');

    let buf = Buffer.concat([pin, Buffer.from(time), Buffer.from(iterator)]);
    let padding = blockSize - buf.length % blockSize;

    let paddingArray = [];
    for (let i=0; i<padding; i++) {
      paddingArray.push(padding);
    }

    //add enough space to the buffer for the cipher.
    buf = Buffer.concat([buf, new Buffer(paddingArray)]);
    let iv16  = crypto.randomBytes(16);
    //encrypt the decrypted pinKey
    let cipher = crypto.createCipheriv('aes-256-cbc', this.hexToBytes(forge.util.binary.hex.encode(pinKey)), iv16);
    cipher.setAutoPadding(false);
    let encrypted_pin_buff = cipher.update(buf, 'utf-8');
    encrypted_pin_buff = Buffer.concat([iv16 , encrypted_pin_buff]);
    return Buffer.from(encrypted_pin_buff).toString('base64');
  },

  hexToBytes: function (hex) {
    var bytes = [];
    for (let c=0; c<hex.length; c+=2) {
      bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
  },

  strip: function(key) {
    if (key.indexOf('-----') !== -1) {
      return key.split('-----')[2].replace(/\r?\n|\r/g, '');
    }
  }
};

export default Mixin;
