import 'simple-line-icons/scss/simple-line-icons.scss';
import './layout.scss';
import $ from 'jquery';
import Navigo from 'navigo';
import Locale from './locale';
import API from './api';
import Wallet from './wallet';


const PartialLoading = require('./loading.html');
const Error404 = require('./404.html');
const router = new Navigo(WEB_ROOT);
const api = new API(router);
const OfflinePlugin = require('offline-plugin/runtime');

window.i18n = new Locale(navigator.language);

router.replace = function(url) {
  this.resolve(url);
  this.pause(true);
  this.navigate(url);
  this.pause(false);
};

router.hooks({
  before: function(done, params) {
    document.title = window.i18n.t('appName');
    $('body').attr('class', 'loading layout');
    $('#layout-container').html(PartialLoading());
    done(true);
  },
  after: function(params) {
    router.updatePageLinks();
  }
});

OfflinePlugin.install({
  onInstalled: function() { },

  onUpdating: function() { },

  onUpdateReady: function() {
    OfflinePlugin.applyUpdate();
  },
  
  onUpdated: function() { }
});


router.on({
  '/': function () {
    if (api.account.loggedIn()) {
      console.log('user is already logged in, lets show their assets');
    } else {
      console.log('user is not logged in, lets create a wallet for them');
      new Wallet(api).newWallet();
    }
  },
  '/account': function () {
    if (api.account.loggedIn()) {
      console.log('user is already logged in, lets show their assets');
    } else {
      console.log('user is not logged in, lets create a wallet for them');
      new Wallet(api).newWallet();
    }
  }
}).notFound(function () {
  $('#layout-container').html(Error404());
  $('body').attr('class', 'error layout');
  router.updatePageLinks();
}).resolve();