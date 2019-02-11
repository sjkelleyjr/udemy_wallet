import './index.scss';
import $ from 'jquery';
import KJUR from 'jsrsasign';


function Wallet(api) {
  this.api = api
  this.templateIndex = require('./index.html');
}

Wallet.prototype = {
  newWallet: function () {
    const self = this;
    
    $('#layout-container').html(self.templateIndex());
    $('body').attr('class', 'wallet layout');

    $('.action.create').on('click', function () {
      console.log('client wants to create a new user.')
      const pin = $('[name="pin"]').val();

      if (pin.length !== 6) {
        self.api.notify('error', i18n.t('wallet.errors.pin'));
        return;
      }
 
      var keyPair = KJUR.KEYUTIL.generateKeypair("RSA", 1024);
      keyPair.prvKeyObj.isPrivate = true;
      var privateKey = KJUR.KEYUTIL.getPEM(keyPair.prvKeyObj, "PKCS1PRV");
      var publicKey = KJUR.KEYUTIL.getPEM(keyPair.pubKeyObj);
      console.log(keyPair);
      console.log(privateKey);
      console.log(publicKey);
    });
  },

};

export default Wallet;
