import './index.scss';
import $ from 'jquery';
import uuid from 'uuid/v4';
import QRious from 'qrious';
import FormUtils from '../utils/form.js';

function Asset(router, api) {
  this.router = router;
  this.api = api;
  this.templateAssets = require('./assets.html');
  this.templateAsset = require('./asset.html');
}

Asset.prototype = {
  
  assets: function () {
    const self = this;
    const preset = self.api.asset.preset();
    self.api.mixin.assets(function (resp) {
      if (resp.error) {
        return;
      }

      var filter = {};
      for (var i = 0; i < resp.data.length; i++) {
        var a = resp.data[i];
        filter[a.asset_id] = true;
        a.depositEnabled = true;
      }

      for (var i = 0; i < preset.length; i++) {
        if (filter[preset[i].asset_id]) {
          continue;
        }
        preset[i].price_usd = '0';
        preset[i].balance = '0';
        preset[i].depositEnabled = true;
        resp.data.push(preset[i]);
      }

      for (var i = 0; i < resp.data.length; i++) {
        resp.data[i].chain_icon_url = self.api.asset.getById(resp.data[i].chain_id).icon_url;
      }
      
      if (resp.data.length != preset.length) {
        resp.data.sort(function (a, b) {
          var at = parseFloat(a.price_usd) * parseFloat(a.balance);
          var bt = parseFloat(b.price_usd) * parseFloat(b.balance);
          if (at > bt) {
            return -1;
          }
          if (at < bt) {
            return 1;
          }
  
          if (a.symbol < b.symbol) {
            return -1;
          }
          if (a.symbol > b.symbol) {
            return 1;
          }
          return 0;
        });
      }

      $('body').attr('class', 'account layout');
      $('#layout-container').html(self.templateAssets({
        assets: resp.data,
      }));

      self.router.updatePageLinks();
    });
  }
};

export default Asset;
