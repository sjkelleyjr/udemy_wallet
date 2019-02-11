import uuid from 'uuid/v4';

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
    });
  },

  strip: function(key) {
    if (key.indexOf('-----') !== -1) {
      return key.split('-----')[2].replace(/\r?\n|\r/g, '');
    }
  }
};

export default Mixin;
