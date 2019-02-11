import Noty from 'noty';
import Account from './account.js';


function API(router) {
  this.router = router;
  this.account = new Account(this);
}

API.prototype = {
  notify: function(type, text) {
    new Noty({
      type: type,
      layout: 'top',
      theme: 'nest',
      text: text,
      timeout: 3000,
      progressBar: false,
      queue: 'api',
      killer: 'api',
      force: true,
      animation: {
        open: 'animated bounceInDown',
        close: 'animated slideOutUp noty'
      }
    }).show();
  }
};


export default API;
